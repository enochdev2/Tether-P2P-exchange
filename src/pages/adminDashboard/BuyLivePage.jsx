import React, { useState, useEffect } from "react";
import TradeCard from "../../components/TradeCard";
import BuyTetherComponent from "../../components/BuyTetherComponent";
import LoadingSpiner from "../../components/LoadingSpiner";
import AdminTradeCard from "../../components/AdminTradeCard";
import AdminTradeCard2 from "../../components/AdminTradeCard2";
import { SuccessToast } from "../../utils/Success";

const BuyLivePage = () => {
  const [buyOrders, setBuyOrders] = useState([]);
  const [loadingBuy, setLoadingBuy] = useState(true);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  // Amount filter state for buy orders: "all", "lt500", "500to1000", "gt1000"
  const [buyAmountFilter, setBuyAmountFilter] = useState("all");

  useEffect(() => {
    fetchBuyOrders();
    fetchBuyPendingOrders();
  }, []);

  async function fetchBuyOrders() {
    try {
      setLoadingBuy(true);
      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/buy/admin/all/onbuy-orders",
        {
          method: "GET",
          headers: {
            // Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch buy orders");
      const data = await response.json();
      console.log("🚀 ~ fetchBuyOrders ~ data:", data);
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
      console.log("🚀 ~ fetchSellOrders ~ buyOrders:", buyPendingOrders);

      setPendingOrders(buyPendingOrders);
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

          <div>
            {pendingOrders &&
              pendingOrders?.map((offer) => (
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

          {/* Render Buy Orders */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Buy Orders</h2>
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

export default BuyLivePage;
