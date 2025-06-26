import { useEffect, useState } from "react";
import AdminTradeCard from "../../components/AdminTradeCard";
import AdminTradeCard2 from "../../components/AdminTradeCard2";
import LoadingSpiner from "../../components/LoadingSpiner";
import NotificationPopup from "../../components/NotificationPopup";
import { ErrorToast } from "../../utils/Error";
import { SuccessToast } from "../../utils/Success";
import AdminTradeInProgressCard from "../../components/AdminTradeInProgressCard";
import { LongSuccessToast } from "../../utils/LongSuccess";
import { useTranslation } from "react-i18next";
import ConfirmModal2 from "../../components/ConfirmModal2";

const SellLivePage = () => {
  const { t } = useTranslation();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [inProgressOrders, setInProgressOrders] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [sellOrders, setSellOrders] = useState([]);
  const [loadingSell, setLoadingSell] = useState(true);
  const [matchWrong, setMatchWrong] = useState(false);
  const [matchWrongMessage, setMatchWrongMessage] = useState("");

  const [selectedFilters, setSelectedFilters] = useState([]);

  // Amount filter state for sell orders: "all", "lt500", "500to1000", "gt1000"

  useEffect(() => {
    fetchSellOrders();
    fetchSellPendingOrders();
    fetchInProgressOrders();
    // fetchNotifications();

    const intervalId = setInterval(() => {
      fetchSellOrders();
      fetchSellPendingOrders();
      fetchInProgressOrders();
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const handleMatch = async (buyerOrderId, sellerOrderId) => {
    try {
      if (!buyerOrderId || !sellerOrderId) return ErrorToast("input buyer Order ID");
      const token = localStorage.getItem("token");

      const response = await fetch(
        // `http://localhost:3000/api/v1/sell/admin/match-orders`,
        `https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/admin/match-orders`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ buyerOrderId, sellerOrderId }),
        }
      );
      // const result = await response.json();

      if (!response.ok) {
        const data = await response.json();
        const errorMsg = data.error || data.message || "Failed to register user";
        if (errorMsg === "These orders were created from the same account.") {
          setMatchWrong(true);
          setMatchWrongMessage(errorMsg);
        }
        ErrorToast(errorMsg);
      } else {
        await fetchInProgressOrders();
        await fetchSellOrders();
        await fetchSellPendingOrders();
        SuccessToast("Orders matched successfully!");
      }
    } catch (error) {
      console.error("Error matching orders:", error);
    }
  };

  const handleCompleteMatch = async (buyerOrderId, sellerOrderId) => {
    try {
      if (!buyerOrderId || !sellerOrderId) return ErrorToast("input buyer Order ID");
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/admin/complete-orders`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ buyerOrderId, sellerOrderId }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        const errorMsg = data.error || data.message || "Failed to register user";
        ErrorToast(errorMsg);
      }

      const result = await response.json();
      const message = result.message || "Orders matched successfully!";
      await fetchInProgressOrders();
      await fetchSellOrders();
      await fetchSellPendingOrders();
      SuccessToast(message);
    } catch (error) {
      console.error("Error matching orders:", error);
    }
  };

  const handleCancleMatch = async (buyerOrderId, sellerOrderId) => {
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
          body: JSON.stringify({ buyerOrderId, sellerOrderId }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        const errorMsg = data.error || data.message || "Failed to register user";
        ErrorToast(errorMsg);
      } else {
        await fetchInProgressOrders();
        await fetchSellOrders();
        await fetchSellPendingOrders();
        SuccessToast("Orders Cancelled successfully!");
      }
    } catch (error) {
      console.error("Error matching orders:", error);
    }
  };

  async function fetchSellOrders() {
    try {
      //   const url = status
      //     ? `https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/sell-orders?status=${encodeURIComponent(
      //         status
      //       )}`
      //     : "https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/sell-orders";

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/admin/all/onsale-orders",
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
        const data = await response.json();
        const errorMsg = data.error || data.message || "Failed to register user";
        ErrorToast(errorMsg);
      }

      const sellOrders = await response.json();

      // Sort oldest date first
      sellOrders?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      setSellOrders(sellOrders);
      // You can now render buyOrders in your UI
      return sellOrders;
    } catch (error) {
      console.error("Failed to fetch sell orders:", error);
      return null;
    } finally {
      setLoadingSell(false);
    }
  }

  async function fetchSellPendingOrders() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/admin/all/pending-orders",
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

      const sellPendingOrders = await response.json();

      //   // Sort oldest date first
      //   sellPendingOrders?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      setPendingOrders(sellPendingOrders);
      // You can now render buyOrders in your UI
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
        // "http://localhost:3000/api/v1/sell/admin/all/inProgress-orders",
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/admin/all/inProgress-orders",
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
        const data = await response.json();
        const errorMsg = data.error || data.message || "Failed to register user";
        ErrorToast(errorMsg);
      }

      const sellInProgressOrders = await response.json();

      // 🔽 Sort to prioritize "In Progress" over "Partially Matched"
      sellInProgressOrders.sort((a, b) => {
        if (a.status === "In Progress" && b.status !== "In Progress") return -1;
        if (a.status === "Partially Matched" && b.status !== "Partially Matched") return 1;
        return 0;
      });

      setInProgressOrders(sellInProgressOrders);
      //   return sellOrders;
    } catch (error) {
      console.error("Failed to fetch sell orders:", error);
      return null;
    }
  }

  async function approveOrders(orderId) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/admin/sell-orders/${orderId}/approve`,
        // "https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/allonsell-orders-orders",
        {
          method: "POST",
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

      const result = await response.json();
      const message = result.message || "Sell Order Approve Successful";
      await fetchSellOrders();
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
        `https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/admin/sell-orders/${orderId}/reject`,
        // "https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/allonsell-orders-orders",
        {
          method: "POST",
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

      const result = await response.json();
      const message = result.message || "Buy Order Rejected Successful";
      await fetchSellOrders();
      SuccessToast(message);

      // Remove the approved order from the current pendingOrders state
      setPendingOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
    } catch (error) {
      console.error("Failed to fetch sell orders:", error);
      return null;
    }
  }

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

  const handleCloseModal = () => {
    setMatchWrong(false);
  };

  // Filter sell orders based on selected filters
  const filteredSellOrders = sellOrders.filter((order) => {
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

  if (loadingSell) return <LoadingSpiner />;

  const Sell = true;

  return (
    <div className="relative">
      <div className="flex bg-gray-50 pt-4 min-h-screen">
        <div className="flex-1 px-4 md:px-8 py-6 overflow-y-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-white shadow rounded-2xl px-6 py-4 mb-8 border border-gray-200">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-green-600 via-[#26a17b] to-green-800 text-transparent bg-clip-text flex items-center gap-2">
              {t("adminPanel.items.sellOrders")}
              {/* <span className="text-emerald-600">(Live)</span> */}
            </h1>
            <button className="bg-gray-200 text-sm text-gray-800 px-5 py-2 rounded-md font-medium hover:bg-gray-300 mt-4 md:mt-0 transition">
              {t("buytether.sortBy")}
            </button>
          </div>

          {/* Filter Buttons */}
          <div className="mb-10 w-full flex justify-center">
            <div className="flex flex-wrap gap-3 mx-auto">
              {[
                { label: "All", key: "all" },
                { label: "10,000 ↑\n30,000 ↓", key: "10000to30000" },
                { label: "30,000 ↑\n50,000 ↓", key: "30000to50000" },
                { label: "50,000 ↑\n100,000 ↓", key: "50000to100000" },
                { label: "100,000 ↑\n200,000 ↓", key: "100000to200000" },
                { label: "200,000 ↑\n300,000 ↓", key: "200000to300000" },
                { label: "300,000 ↑\n500,000 ↓", key: "300000to500000" },
                { label: "500,000 ↑\n1,000,000 ↓", key: "500000to1000000" },
                { label: "1,000,000 ↑", key: "gt1000000" },
              ].map(({ label, key }) => (
                <button
                  key={key}
                  onClick={() => handleAmountFilterChange(key)}
                  className={`whitespace-pre-line cursor-pointer px-4 py- rounded-md text-[15px] font-medium shadow-sm transition duration-150 ${
                    (key === "all" && selectedFilters.length === 0) || selectedFilters.includes(key)
                      ? "bg-[#26a17b] text-white"
                      : "bg-gray-100 text-gray-700 border border-slate-300 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders In Progress */}
          {inProgressOrders.length > 0 && (
            <div className="mb-10">
              <h2 className="text-lg md:text-xl font-semibold mb-4 px-4 py-2 bg-slate-100 border border-gray-300 rounded-xl shadow-sm">
                {t("buytether.allOrdersInProgress")}
              </h2>
              <div className="space-y-4">
                {inProgressOrders.map((offer) => (
                  <AdminTradeInProgressCard
                    key={offer._id}
                    offer={offer}
                    sell={Sell}
                    fetchOrders={fetchInProgressOrders}
                    onMatch={handleCompleteMatch}
                    onMatchs={handleMatch}
                    onCancel={handleCancleMatch}
                    showChatButton={offer.status === "On Sale"}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Pending Orders */}
          {pendingOrders.length > 0 && (
            <div className="mb-10">
              <h2 className="text-lg md:text-xl font-semibold mb-4 px-4 py-2 bg-slate-100 border border-gray-300 rounded-xl shadow-sm">
                {t("buytether.allPendingOrders")}
              </h2>
              <div className="space-y-4">
                {pendingOrders.map((offer) => (
                  <AdminTradeCard2
                    key={offer._id}
                    offer={offer}
                    sell={Sell}
                    approveOrders={() => approveOrders(offer._id)}
                    rejectOrders={() => rejectOrders(offer._id)}
                    setPendingOrders={setPendingOrders}
                    showChatButton={offer.status === "Pending Approval"}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Live Sell Orders */}
          <div className="mb-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4 px-4 py-2 bg-slate-100 border border-gray-300 rounded-xl shadow-sm">
              {t("buytether.allSellOrders")}
            </h2>
            {filteredSellOrders.length === 0 ? (
              <p className="text-gray-500 italic text-sm">No sell orders match the filter.</p>
            ) : (
              <div className="space-y-4">
                {filteredSellOrders.map((offer) => (
                  <AdminTradeCard
                    key={offer._id}
                    offer={offer}
                    sell={Sell}
                    fetchOrders={fetchSellOrders}
                    onMatch={handleMatch}
                    showChatButton={offer.status === "On Sale"}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        {matchWrong && (
          <ConfirmModal2 open={matchWrong} onClose={handleCloseModal} message={matchWrongMessage} />
        )}
      </div>
    </div>
  );
};

export default SellLivePage;
