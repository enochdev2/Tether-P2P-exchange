import { useEffect, useState } from "react";
import BuyTetherComponent from "../../components/BuyTetherComponent";
import LoadingSpiner from "../../components/LoadingSpiner";
import TradeCard from "../../components/TradeCard";
import AdminTradeCard from "../../components/AdminTradeCard";
import AdminTradeCard2 from "../../components/AdminTradeCard2";
import { SuccessToast } from "../../utils/Success";
import { ErrorToast } from "../../utils/Error";

const SellLivePage = () => {
  const [activeLink, setActiveLink] = useState("findOffers");
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sellOrders, setSellOrders] = useState([]);
  const [loadingSell, setLoadingSell] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  // Amount filter state for sell orders: "all", "lt500", "500to1000", "gt1000"

  const [sellAmountFilter, setSellAmountFilter] = useState("all");

  useEffect(() => {
    fetchSellOrders();
    fetchSellPendingOrders();
  }, []);

  const handleMatch = async (buyerOrderId, sellerOrderId) => {
    try {

      if(!buyerOrderId || !sellerOrderId) return ErrorToast("input buyer Order ID")
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

      if (!response.ok) {
        throw new Error(`Failed to match orders: ${response.status}`);
      }

      const result = await response.json();
      console.log("Orders matched successfully:", result);
       await fetchSellOrders();
      SuccessToast("Orders matched successfully!");
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
        throw new Error(`HTTP error! Status: ${response.status}`);
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
      console.log("🚀 ~ fetchSellOrders ~ sellOrders:", sellPendingOrders);

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
      console.log("Order approved:", result);
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
      console.log("Order approved:", result);
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

  useEffect(() => {
    fetchNotifications();
  }, []);

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

      if (!response.ok) throw new Error("Failed to fetch notifications");

      const data = await response.json();
      console.log("🚀 ~ fetchNotifications ~ data:", data);
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

      if (!response.ok) throw new Error("Failed to mark notification as read");

      console.log("🚀 ~ markNotificationRead ~ response:", response);
      // Remove the marked notification from state so the card disappears
      setNotifications((prev) =>
        prev.filter((notif) => notif._id !== notificationId)
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }

  // Handle amount filter button clicks
  const handleAmountFilterChange = (filter) => {
    setSellAmountFilter(filter);
  };

  // Filter sell orders based on amount
  const filteredSellOrders = sellOrders.filter((order) => {
    if (sellAmountFilter === "all") return true;
    if (sellAmountFilter === "lt500") return order.amount < 500;
    if (sellAmountFilter === "500to1000")
      return order.amount >= 500 && order.amount <= 1000;
    if (sellAmountFilter === "gt1000") return order.amount > 1000;
    return true;
  });

  if (loadingSell) return <LoadingSpiner />;

  const Sell = true;

  return (
    <div>
      <div className="flex bg-gray-100 pt-2 min-h-screen">
        <div className="flex-1 p-6 overflow-y-auto">
          {/* <BuyTetherComponent /> */}

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
          <div className="mb-6 space-x-3">
            <button
              onClick={() => handleAmountFilterChange("all")}
              className={`px-4 py-2 rounded-md font-semibold ${
                sellAmountFilter === "all"
                  ? "bg-[#26a17b] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleAmountFilterChange("lt500")}
              className={`px-4 py-2 rounded-md font-semibold ${
                sellAmountFilter === "lt500"
                  ? "bg-[#26a17b] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              &lt; 500
            </button>
            <button
              onClick={() => handleAmountFilterChange("500to1000")}
              className={`px-4 py-2 rounded-md font-semibold ${
                sellAmountFilter === "500to1000"
                  ? "bg-[#26a17b] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              500 - 1000
            </button>
            <button
              onClick={() => handleAmountFilterChange("gt1000")}
              className={`px-4 py-2 rounded-md font-semibold ${
                sellAmountFilter === "gt1000"
                  ? "bg-[#26a17b] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              &gt; 1000
            </button>
          </div>

          <div>
            {pendingOrders &&
              pendingOrders?.map((offer) => (
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

          {/* Render Sell Orders */}
          <div className="mb-5">
            <h2 className="text-xl font-semibold mb-4">Sell Orders</h2>
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
      {!loadingNotifications && notifications.length > 0 && (
        <div
          className="fixed bottom-5 right-5 w-80 max-w-full bg-white  border-2 border-red-700 rounded-lg  shadow-lg p-4 z-50"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          <h3 className="font-semibold mb-2 text-red-600 text-lg">
            Unread Notifications
          </h3>
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className="mb-3 p-3 bg-green-50 border border-green-300 rounded"
            >
              <p className="text-sm mb-2">{notif.message}</p>
              <button
                onClick={() => markNotificationRead(notif._id)}
                className="text-xs bg-green-600 hover:bg-green-700 cursor-pointer text-white py-1 px-3 rounded"
                type="button"
              >
                Mark as Read
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellLivePage;
