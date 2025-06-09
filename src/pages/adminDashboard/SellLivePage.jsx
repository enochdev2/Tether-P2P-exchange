import { useEffect, useState } from "react";
import AdminTradeCard from "../../components/AdminTradeCard";
import AdminTradeCard2 from "../../components/AdminTradeCard2";
import LoadingSpiner from "../../components/LoadingSpiner";
import NotificationPopup from "../../components/NotificationPopup";
import { ErrorToast } from "../../utils/Error";
import { SuccessToast } from "../../utils/Success";
import AdminTradeInProgressCard from "../../components/AdminTradeInProgressCard";
import { LongSuccessToast } from "../../utils/LongSuccess";

const SellLivePage = () => {
  const [activeLink, setActiveLink] = useState("findOffers");
  const [pendingOrders, setPendingOrders] = useState([]);
  const [inProgressOrders, setInProgressOrders] = useState([]);
  console.log("🚀 ~ SellLivePage ~ inProgressOrders:", inProgressOrders);
  const [loading, setLoading] = useState(true);
  const [sellOrders, setSellOrders] = useState([]);
  const [loadingSell, setLoadingSell] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const [selectedFilters, setSelectedFilters] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  // Amount filter state for sell orders: "all", "lt500", "500to1000", "gt1000"

  const [sellAmountFilter, setSellAmountFilter] = useState("all");

  useEffect(() => {
    fetchSellOrders();
    fetchSellPendingOrders();
    fetchInProgressOrders();
    fetchNotifications();
  }, []);

  const handleMatch = async (buyerOrderId, sellerOrderId) => {
    try {
      if (!buyerOrderId || !sellerOrderId)
        return ErrorToast("input buyer Order ID");
      const token = localStorage.getItem("token");

      const response = await fetch(
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
      const result = await response.json();

      if (!response.ok) {
        const data = await res.json();
        const errorMsg =
          data.error || data.message || "Failed to register user";
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
      if (!buyerOrderId || !sellerOrderId)
        return ErrorToast("input buyer Order ID");
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
        const data = await res.json();
        const errorMsg =
          data.error || data.message || "Failed to register user";
        ErrorToast(errorMsg);
      }

      const result = await response.json();
      await fetchInProgressOrders();
      await fetchSellOrders();
      await fetchSellPendingOrders();
      SuccessToast("Orders matched successfully!");
    } catch (error) {
      console.error("Error matching orders:", error);
    }
  };

  const handleCancleMatch = async (buyerOrderId, sellerOrderId) => {
    try {
      if (!buyerOrderId || !sellerOrderId)
        return ErrorToast("input buyer Order ID");
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
      const data = await response.json();

      if (!response.ok) {
        const data = await res.json();
        const errorMsg =
          data.error || data.message || "Failed to register user";
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

  async function fetchSellOrders(status = "") {
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
        const data = await res.json();
        const errorMsg =
          data.error || data.message || "Failed to register user";
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

  async function fetchSellPendingOrders(status = "") {
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
        // "https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/admin/all/inProgress-orders",
        "http://localhost:3000/api/v1/sell/admin/all/inProgress-orders",
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
        const data = await res.json();
        const errorMsg =
          data.error || data.message || "Failed to register user";
        ErrorToast(errorMsg);
      }

      const sellInProgressOrders = await response.json();

      // 🔽 Sort to prioritize "In Progress" over "Partially Matched"
      sellInProgressOrders.sort((a, b) => {
        if (a.status === "In Progress" && b.status !== "In Progress") return -1;
        if (
          a.status === "Partially Matched" &&
          b.status !== "Partially Matched"
        )
          return 1;
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
      SuccessToast("Sell Order Approve Successful");

      // Remove the approved order from the current pendingOrders state
      setPendingOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
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
      SuccessToast("Buy Order Rejected Successful");

      // Remove the approved order from the current pendingOrders state
      setPendingOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
    } catch (error) {
      console.error("Failed to fetch sell orders:", error);
      return null;
    }
  }

  async function fetchNotifications() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/notification/unread/sellOrders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const data = await res.json();
        const errorMsg =
          data.error || data.message || "Failed to register user";
        ErrorToast(errorMsg);
      }

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        LongSuccessToast("You have a new notification message on sell order");
      }
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  }

  async function markNotificationRead(notificationId) {
    try {
      const token = localStorage.getItem("token");
      // `https://tether-p2p-exchang-backend.onrender.com/api/v1/notification/mark-read/${notificationId}`,
      const response = await fetch(
        `https://tether-p2p-exchang-backend.onrender.com/api/v1/notification/mark-read/${notificationId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const data = await res.json();
        const errorMsg =
          data.error || data.message || "Failed to register user";
        ErrorToast(errorMsg);
      }

      setNotifications((prev) =>
        prev.filter((notif) => notif._id !== notificationId)
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
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

  // Filter sell orders based on selected filters
  const filteredSellOrders = sellOrders.filter((order) => {
    if (selectedFilters.length === 0) return true;

    // Check for the different filter ranges
    if (
      selectedFilters.includes("500to1000") &&
      order.krwAmount >= 500 &&
      order.krwAmount <= 1000
    )
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
    if (selectedFilters.includes("gt1000000") && order.krwAmount > 1000000)
      return true;

    return false;
  });

  if (loadingSell) return <LoadingSpiner />;

  const Sell = true;

  return (
    <div>
      <div className="flex bg-gray-100 pt-2 ">
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6 border bg-slate-200 border-slate-300 px-4 py-3 md:mb-12 rounded-2xl ">
            <div className=" px-5 py-2 rounded-2xl ">
              <h1 className="text-3xl font-bold bg-gradient-to-br from-green-600 via-[#26a17b] to-green-800 text-transparent bg-clip-text ">
                Sell Orders (
                <span className="text-emerald-70 text-shadow-emerald-400">
                  Live
                </span>
                )
              </h1>
            </div>

            <div className="space-x-4">
              <button className="bg-gray-200 px-4 py-2 rounded-md">
                Sort By
              </button>
            </div>
          </div>

          {/* Amount Filter Buttons for Sell Orders */}
          <div className="mb-6 space-x-2 space-y-3 text-base flex flex-wrap items-center">
            {/* Amount Filter Buttons */}
            <button
              onClick={() => handleAmountFilterChange("all")}
              className={`px-5 py-2 cursor-pointer rounded-md font-semibold ${
                selectedFilters.length === 0
                  ? "bg-[#26a17b] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleAmountFilterChange("10000to30000")}
              className={`px-6 cursor-pointer rounded-md font-semibold ${
                selectedFilters.includes("10000to30000")
                  ? "bg-[#26a17b] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              10,000 ↑ <br /> 30,000 ↓
            </button>
            <button
              onClick={() => handleAmountFilterChange("30000to50000")}
              className={`px-6 cursor-pointer rounded-md font-semibold ${
                selectedFilters.includes("30000to50000")
                  ? "bg-[#26a17b] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              30,000 ↑ <br /> 50,000 ↓
            </button>
            <button
              onClick={() => handleAmountFilterChange("50000to100000")}
              className={`px-6 cursor-pointer rounded-md font-semibold ${
                selectedFilters.includes("50000to100000")
                  ? "bg-[#26a17b] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              50,000 ↑ <br /> 100,000 ↓
            </button>
            <button
              onClick={() => handleAmountFilterChange("100000to200000")}
              className={`px-6 cursor-pointer rounded-md font-semibold ${
                selectedFilters.includes("100000to200000")
                  ? "bg-[#26a17b] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              100,000 ↑ <br /> 200,000 ↓
            </button>
            <button
              onClick={() => handleAmountFilterChange("200000to300000")}
              className={`px-6 cursor-pointer rounded-md font-semibold ${
                selectedFilters.includes("200000to300000")
                  ? "bg-[#26a17b] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              200,000 ↑ <br /> 300,000 ↓
            </button>
            <button
              onClick={() => handleAmountFilterChange("300000to500000")}
              className={`px-6 cursor-pointer rounded-md font-semibold ${
                selectedFilters.includes("300000to500000")
                  ? "bg-[#26a17b] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              300,000 ↑ <br /> 500,000 ↓
            </button>
            <button
              onClick={() => handleAmountFilterChange("500000to1000000")}
              className={`px-6 cursor-pointer rounded-md font-semibold ${
                selectedFilters.includes("500000to1000000")
                  ? "bg-[#26a17b] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              500,000 ↑ <br /> 1,000,000 ↓
            </button>
            <button
              onClick={() => handleAmountFilterChange("gt1000000")}
              className={`px-6 py-2 cursor-pointer rounded-md font-semibold ${
                selectedFilters.includes("gt1000000")
                  ? "bg-[#26a17b] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              1,000,000 ↑
            </button>
          </div>

          {/* Render Sell Orders In Progress */}
          <div className="mb-5">
            {inProgressOrders.length !== 0 && (
              <div className="">
                <h2 className="text-xl rounded-2xl shadow-lg py-2 border-slate-400 border font-bold mb-4 bg-slate-200 px-3">
                  All Order In Progress
                </h2>
                {inProgressOrders.map((offer) => (
                  <AdminTradeInProgressCard
                    key={offer._id}
                    offer={offer}
                    sell={Sell}
                    onMatch={handleCompleteMatch}
                    onMatchs={handleMatch}
                    onCancel={handleCancleMatch}
                    showChatButton={offer.status === "On Sale"}
                    onChatClick={() => navigate(`/admin/chat/${offer._id}`)}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            {pendingOrders.length !== 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  All Pending Sell Orders
                </h2>
                {pendingOrders?.map((offer) => (
                  <AdminTradeCard2
                    key={offer._id}
                    offer={offer}
                    sell={Sell}
                    approveOrders={() => approveOrders(offer._id)}
                    rejectOrders={() => rejectOrders(offer._id)}
                    setPendingOrders={setPendingOrders}
                    showChatButton={offer.status === "Pending Approval"}
                    onChatClick={() => navigate(`/admin/chat/${offer._id}`)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Render Sell Orders */}
          <div className="mb-5">
            <h2 className="text-xl rounded-2xl shadow-lg py-2 border-slate-400 border font-bold mb-4 bg-slate-200 px-3">
              All Live Sell Orders
            </h2>
            {filteredSellOrders.length === 0 ? (
              <p className="text-gray-500">No sell orders match the filter.</p>
            ) : (
              filteredSellOrders.map((offer) => (
                <AdminTradeCard
                  key={offer._id}
                  offer={offer}
                  sell={Sell}
                  onMatch={handleMatch}
                  showChatButton={offer.status === "On Sale"}
                  onChatClick={() => navigate(`/admin/chat/${offer._id}`)}
                />
              ))
            )}
          </div>
        </div>
      </div>
      {/* Notification Alert Box */}
      <NotificationPopup
        loading={loadingNotifications}
        notifications={notifications}
        onMarkRead={markNotificationRead}
      />
    </div>
  );
};

export default SellLivePage;
