import { useEffect, useState } from "react";
import AdminTradeCard from "../../components/AdminTradeCard";
import AdminTradeCard2 from "../../components/AdminTradeCard2";
import AdminTradeInProgressCard from "../../components/AdminTradeInProgressCard";
import LoadingSpiner from "../../components/LoadingSpiner";
import NotificationPopup from "../../components/NotificationPopup";
import { ErrorToast } from "../../utils/Error";
import { SuccessToast } from "../../utils/Success";
import { LongSuccessToast } from "../../utils/LongSuccess";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const BuyLivePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [buyOrders, setBuyOrders] = useState([]);
  const [loadingBuy, setLoadingBuy] = useState(true);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [inProgressOrders, setInProgressOrders] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Amount filter state for buy orders: "all", "lt500", "500to1000", "gt1000"

  useEffect(() => {
    fetchInProgressOrders();
    fetchBuyPendingOrders();
    fetchBuyOrders();

    const intervalId = setInterval(() => {
      fetchInProgressOrders();
      fetchBuyPendingOrders();
      fetchBuyOrders();
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  async function fetchBuyOrders() {
    try {
      setLoadingBuy(false);
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/buy/admin/all/onbuy-orders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const data = await response.json();
        const errorMsg = data.error || data.message || "Failed to register user";
        if (errorMsg === "Invalid or expired token") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("isLoggedIn");
          navigate("/signin");
        }
        ErrorToast(errorMsg);
      }

      data?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      // const statusPriority = {
      //   "Waiting for Buy": 1,
      //   "Buy Completed": 2,
      // };

      setBuyOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingBuy(false);
    }
  }

  async function fetchBuyPendingOrders() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/buy/admin/all/pending-orders",
        // "https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/allonsell-orders-orders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          // credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const buyPendingOrders = await response.json();

      setPendingOrders(buyPendingOrders);
      //   return sellOrders;
    } catch (error) {
      console.error("Failed to fetch sell orders:", error);
      return null;
    }
  }

  async function fetchInProgressOrders() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/buy/admin/all/inProgress-orders",
        // "https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/allonsell-orders-orders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          // credentials: "include",
        }
      );
      const buyInProgressOrders = await response.json();

      if (!response.ok) {
        const data = await response.json();
        const errorMsg = data.error || data.message || "Failed to register user";
        ErrorToast(errorMsg);
      }

      buyInProgressOrders.sort((a, b) => {
        if (a.status === "In Progress" && b.status !== "In Progress") return -1;
        if (a.status === "Partially Matched" && b.status !== "Partially Matched") return 1;
        return 0;
      });

      //   sellPendingOrders?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      setInProgressOrders(buyInProgressOrders);
      // You can now render buyOrders in your UI
      //   return sellOrders;
    } catch (error) {
      console.error("Failed to fetch sell orders:", error);
      return null;
    }
  }

  const handleCancleMatch = async (sellerOrderId, buyerOrderId) => {
    try {
      if (!buyerOrderId || !sellerOrderId) return ErrorToast("input buyer Order ID");
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/admin/cancel-orders`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            buyerOrderId,
            sellerOrderId,
            storedLanguage: localStorage.getItem("language"),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to match orders: ${response.status}`);
      }

      const result = await response.json();

      const messages = result.message || "Orders cancelled successfully!";
      const message = t("messages.ordersCancelled") || messages;

      await fetchInProgressOrders();
      await fetchBuyOrders();
      await fetchBuyPendingOrders();
      SuccessToast(message);
    } catch (error) {
      console.error("Error cancelling orders:", error);
    }
  };

  async function approveOrders(orderId) {
    try {
      const token = localStorage.getItem("token");

      // `http://localhost:3000/api/v1/buy/admin/buy-orders/${orderId}/approve`,
      const response = await fetch(
        `https://tether-p2p-exchang-backend.onrender.com/api/v1/buy/admin/buy-orders/${orderId}/approve`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            storedLanguage: localStorage.getItem("language"),
          }),
          // credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      const message = t("messages.buyOrderApproved") || result.message || "Buy Order Approved Successfully";

      await fetchInProgressOrders();
      await fetchBuyOrders();
      await fetchBuyPendingOrders();
      SuccessToast(message);

      // Remove the approved order from the current pendingOrders state
      setPendingOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
    } catch (error) {
      console.error("Failed to fetch sell orders:", error);
      return null;
    }
  }

  async function rejectOrders(orderId) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        // `https://tether-p2p-exchang-backend.onrender.com/api/v1/buy/admin/buy-orders/${orderId}/reject`,
        `https://tether-p2p-exchang-backend.onrender.com/api/v1/buy/admin/buy-orders/${orderId}/reject`,
        // "https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/allonsell-orders-orders",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            storedLanguage: localStorage.getItem("language"),
          }),
          // credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      const message = t("messages.buyOrderRejectedConfirm") || result.message;
      
      SuccessToast(message);

      // Remove the approved order from the current pendingOrders state
      setPendingOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
    } catch (error) {
      console.error("Failed to fetch sell orders:", error);
      return null;
    }
  }

  // Handle amount filter button clicks
  const handleAmountFilterChange = (filter) => {
    if (filter === "all") {
      // If "All" is clicked, reset the filters
      setSelectedFilters([]);
    } else {
      // Toggle the filter
      setSelectedFilters((prevFilters) =>
        prevFilters.includes(filter)
          ? prevFilters.filter((item) => item !== filter)
          : [...prevFilters, filter]
      );
    }
  };

  const filteredBuyOrders = buyOrders.filter((order) => {
    if (selectedFilters.length === 0) return true;

    // Check for the different filter ranges
    if (selectedFilters.includes("500to1000") && order.krwAmount >= 500 && order.krwAmount <= 1000)
      return true;

    if (
      selectedFilters.includes("10000to30000") &&
      order.krwAmount >= 10000 &&
      order.krwAmount <= 30000
    )
      return true;

    if (
      selectedFilters.includes("30000to50000") &&
      order.krwAmount >= 30000 &&
      order.krwAmount <= 50000
    )
      return true;

    if (
      selectedFilters.includes("50000to100000") &&
      order.krwAmount >= 50000 &&
      order.krwAmount <= 100000
    )
      return true;

    if (
      selectedFilters.includes("100000to200000") &&
      order.krwAmount >= 100000 &&
      order.krwAmount <= 200000
    )
      return true;

    if (
      selectedFilters.includes("200000to300000") &&
      order.krwAmount >= 200000 &&
      order.krwAmount <= 300000
    )
      return true;

    if (
      selectedFilters.includes("300000to500000") &&
      order.krwAmount >= 300000 &&
      order.krwAmount <= 500000
    )
      return true;

    if (
      selectedFilters.includes("500000to1000000") &&
      order.krwAmount >= 500000 &&
      order.krwAmount <= 1000000
    )
      return true;

    // Filter for amounts greater than 1,000,000 (gt1000000)
    if (selectedFilters.includes("gt1000000") && order.krwAmount > 1000000) return true;

    return false;
  });

  if (loadingBuy) return <LoadingSpiner />;

  return (
    <div>
      <div className="flex bg-gray-100 pt-2 min-h-screen">
        <div className="flex-1 px-6 py-3 overflow-y-auto">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6 border bg-slate-200 border-slate-300 px-4 py-3 md:mb-12 rounded-2xl">
            <div className="px-5 py-2 rounded-2xl">
              <h1 className="text-3xl font-bold bg-gradient-to-br from-green-600 via-[#26a17b] to-green-800 text-transparent bg-clip-text">
                {t("adminPanel.items.buyOrders")}
                {/* (<span className="text-emerald-70 text-shadow-emerald-400">Live</span>) */}
              </h1>
            </div>
            <div className="space-x-4">
              <button className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 font-medium transition">
                {t("buytether.sortBy")}
              </button>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="mb-10 w-full flex justify-center">
            <div className="mb-6 flex flex-wrap gap-2 text-sm ">
              {[
                { label: "All", value: "all" },
                { label: "10,000 ↑\n30,000 ↓", value: "10000to30000" },
                { label: "30,000 ↑\n50,000 ↓", value: "30000to50000" },
                { label: "50,000 ↑\n100,000 ↓", value: "50000to100000" },
                { label: "100,000 ↑\n200,000 ↓", value: "100000to200000" },
                { label: "200,000 ↑\n300,000 ↓", value: "200000to300000" },
                { label: "300,000 ↑\n500,000 ↓", value: "300000to500000" },
                { label: "500,000 ↑\n1,000,000 ↓", value: "500000to1000000" },
                { label: "1,000,000 ↑", value: "gt1000000" },
              ].map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => handleAmountFilterChange(value)}
                  className={`px-5 py-2 rounded-md font-semibold whitespace-pre-line transition-all duration-200 ${
                    selectedFilters.includes(value) ||
                    (value === "all" && selectedFilters.length === 0)
                      ? "bg-[#26a17b] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* In Progress Orders */}
          {inProgressOrders.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl text-green-700 border border-slate-400 rounded-2xl bg-slate-200 px-4 py-2 font-bold shadow">
                {t("buytether.allOrdersInProgress")}
              </h2>
              <div className="mt-4 space-y-4">
                {inProgressOrders.map((offer) => (
                  <AdminTradeInProgressCard
                    key={offer._id}
                    offer={offer}
                    sell={false}
                    onCancel={handleCancleMatch}
                    showChatButton={offer.status === "On Sale"}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Pending Orders */}
          {pendingOrders.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl text-red-700 border border-slate-400 rounded-2xl bg-slate-200 px-4 py-2 font-bold shadow">
                {t("buytether.allPendingOrders")}
              </h2>
              <div className="mt-4 space-y-4">
                {pendingOrders.map((offer) => (
                  <AdminTradeCard2
                    key={offer._id}
                    offer={offer}
                    approveOrders={() => approveOrders(offer._id)}
                    rejectOrders={() => rejectOrders(offer._id)}
                    setPendingOrders={setPendingOrders}
                    showChatButton={offer.status === "Pending Approval"}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Live Buy Orders */}
          <div>
            <h2 className="text-xl text-black border border-slate-400 rounded-2xl bg-slate-200 px-4 py-2 font-bold shadow">
              {t("buytether.allBuyOrders")}
            </h2>
            <div className="mt-4 space-y-4">
              {filteredBuyOrders.length === 0 ? (
                <p className="text-gray-500">No buy orders found.</p>
              ) : (
                filteredBuyOrders.map((offer) => (
                  <AdminTradeCard
                    key={offer._id}
                    offer={offer}
                    showChatButton={offer.status === "Waiting for Buy"}
                    fetchOrders={fetchBuyOrders}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyLivePage;
