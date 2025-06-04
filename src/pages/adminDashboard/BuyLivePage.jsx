import { useEffect, useState } from "react";
import AdminTradeCard from "../../components/AdminTradeCard";
import AdminTradeCard2 from "../../components/AdminTradeCard2";
import AdminTradeInProgressCard from "../../components/AdminTradeInProgressCard";
import LoadingSpiner from "../../components/LoadingSpiner";
import NotificationPopup from "../../components/NotificationPopup";
import { ErrorToast } from "../../utils/Error";
import { SuccessToast } from "../../utils/Success";
import { LongSuccessToast } from "../../utils/LongSuccess";

const BuyLivePage = () => {
  const [buyOrders, setBuyOrders] = useState([]);
  const [loadingBuy, setLoadingBuy] = useState(true);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [inProgressOrders, setInProgressOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  // Amount filter state for buy orders: "all", "lt500", "500to1000", "gt1000"
  const [buyAmountFilter, setBuyAmountFilter] = useState("all");

  useEffect(() => {
    fetchInProgressOrders();
    fetchBuyPendingOrders();
    fetchBuyOrders();
  }, []);

  async function fetchBuyOrders() {
    try {
      setLoadingBuy(true);
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
        const errorMsg =
          data.error || data.message || "Failed to register user";
        ErrorToast(errorMsg);
      }

      data?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      const statusPriority = {
        "Waiting for Buy": 1,
        "Buy Completed": 2,
      };

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
        const data = await res.json();
        const errorMsg =
          data.error || data.message || "Failed to register user";
        ErrorToast(errorMsg);
      }

      //   // Sort oldest date first
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
    console.log("🚀 ~ handleCancleMatch ~ sellerOrderId:", sellerOrderId);
    console.log("🚀 ~ handleCancleMatch ~ sellerOrderId:", buyerOrderId);
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

      if (!response.ok) {
        throw new Error(`Failed to match orders: ${response.status}`);
      }

      const result = await response.json();

      console.log("Orders cancelled successfully:", result);
      await fetchInProgressOrders();
      await fetchBuyOrders();
      await fetchBuyPendingOrders();
      SuccessToast("Orders Cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling orders:", error);
    }
  };

  async function approveOrders(orderId) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://tether-p2p-exchang-backend.onrender.com/api/v1/buy/admin/buy-orders/${orderId}/approve`,
        // `http://localhost:3000/api/v1/buy/admin/buy-orders/${orderId}/approve`,
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
      SuccessToast("Buy Order Approve Successful");

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
        // `https://tether-p2p-exchang-backend.onrender.com/api/v1/buy/admin/buy-orders/${orderId}/reject`,
        `https://tether-p2p-exchang-backend.onrender.com/api/v1/buy/admin/buy-orders/${orderId}/reject`,
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
      SuccessToast("Buyer Order Rejected Successful");

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
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/notification/unread/buyOrders",
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
        LongSuccessToast("You have a new notification message on buy order");
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

      if (!response.ok) throw new Error("Failed to mark notification as read");

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
    setBuyAmountFilter(filter);
  };

  // Filter buy orders based on amount
  const filteredBuyOrders = buyOrders?.filter((order) => {
    if (buyAmountFilter === "all") return true;
    if (buyAmountFilter === "lt500") return order.amount < 500;
    if (buyAmountFilter === "500to1000")
      return order.amount >= 500 && order.amount <= 1000;
    if (buyAmountFilter === "gt1000") return order.amount > 1000;
    return true;
  });

  if (loadingBuy) return <LoadingSpiner />;

  return (
    <div>
      <div className="flex bg-gray-100 pt-2 min-h-screen">
        <div className="flex-1 px-6 py-3 overflow-y-auto">
          {/* <BuyTetherComponent /> */}

          <div className="flex justify-between items-center mb-6 border bg-slate-200 border-slate-300 px-4 py-3 md:mb-12 rounded-2xl ">
            <div className=" px-5 py-2 rounded-2xl ">
              <h1 className="text-3xl font-bold bg-gradient-to-br from-green-600 via-[#26a17b] to-green-800 text-transparent bg-clip-text ">
                Buy Orders (
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

          {/* Amount Filter Buttons for Buy Orders */}
          <div className="mb-6 space-x-3">
            {[
              { label: "All", value: "all" },
              { label: "< 500", value: "lt500" },
              { label: "500 - 1000", value: "500to1000" },
              { label: "> 1000", value: "gt1000" },
            ].map(({ label, value }) => (
              <button
                key={value}
                onClick={() => handleAmountFilterChange(value)}
                className={`px-4 py-2 rounded-md font-semibold ${
                  buyAmountFilter === value
                    ? "bg-[#26a17b] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Render Sell Orders In Progress */}
          <div className="mb-5">
            {inProgressOrders.length !== 0 && (
              <div className="">
                <h2 className="text-xl text-green-700 rounded-2xl shadow-lg py-2 border-slate-400 border font-bold mb-4 bg-slate-200 px-3">
                  All  Orders In Progress
                </h2>
                {inProgressOrders.map((offer) => (
                  <AdminTradeInProgressCard
                    key={offer._id}
                    offer={offer}
                    sell={false}
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
                <h2 className="text-lg text-red-700 rounded-2xl shadow-lg py-1 border-slate-400 border font-bold mb-4 bg-slate-200 px-3">
                  All Pending Orders
                </h2>
                {pendingOrders?.map((offer) => (
                  <AdminTradeCard2
                    key={offer._id}
                    offer={offer}
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

          {/* Render Buy Orders */}
          <div>
            <h2 className="text-lg text-black rounded-2xl shadow-lg py-1 border-slate-400 border font-bold mb-4 bg-slate-200 px-3">
              All Live Buy Orders
            </h2>
            {filteredBuyOrders.length === 0 ? (
              <p className="text-gray-500">No buy orders found.</p>
            ) : (
              filteredBuyOrders.map((offer) => (
                <AdminTradeCard
                  key={offer._id}
                  offer={offer}
                  showChatButton={offer.status === "Waiting for Buy"}
                  onChatClick={() => navigate(`/admin/chat/${offer._id}`)}
                />
              ))
            )}
          </div>
        </div>
      </div>
      <NotificationPopup
        loading={loadingNotifications}
        notifications={notifications}
        onMarkRead={markNotificationRead}
      />
    </div>
  );
};

export default BuyLivePage;
