import { useEffect, useState } from "react";
import BuyTetherComponent from "../../components/BuyTetherComponent";
import LoadingSpiner from "../../components/LoadingSpiner";
import NotificationPopup from "../../components/NotificationPopup";
import TradeCard from "../../components/TradeCard";
import UserTradeInProgressCard from "../dashboard/UserTradeInProgressCard";
import { ErrorToast } from "../../utils/Error";
import { LongSuccessToast } from "../../utils/LongSuccess";
import { SuccessToast } from "../../utils/Success";

const TradingPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [inProgressOrders, setInProgressOrders] = useState([]);

  useEffect(() => {
    fetchInProgressOrders();
    fetchBuyOrders();
     fetchNotifications();
  }, []);

  // Function to fetch buy orders, optionally filtered by status
  async function fetchBuyOrders(status = "") {
    try {
      // Build the URL with optional status query parameter
      const url = status
        ? `https://tether-p2p-exchang-backend.onrender.com/api/buy/buy-orders?status=${encodeURIComponent(
            status
          )}`
        : "https://tether-p2p-exchang-backend.onrender.com/api/v1/buy/buy-orders";
      // : "http://localhost:3000/api/v1/buy/buy-orders";

      const token = localStorage.getItem("token");

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const buyOrders = await response.json();

      if (!response.ok) {
        const data = await response.json();
        const errorMsg =
          data.error || data.message || "Failed to register user";
        ErrorToast(errorMsg);
      }

      const statusPriority = {
        "Pending Approval": 1,
        "Waiting for Buy": 2,
        "Buy Completed": 3,
        "In Progress": 4,
      };

      buyOrders.sort((a, b) => {
        if (statusPriority[a.status] !== statusPriority[b.status]) {
          return statusPriority[a.status] - statusPriority[b.status];
        }
        // If same status, sort by createdAt descending
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setOrders(buyOrders);
      // You can now render buyOrders in your UI
      return buyOrders;
    } catch (error) {
      console.error("Failed to fetch buy orders:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function fetchInProgressOrders() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/buy/user/inProgress-orders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const buyInProgressOrders = await response.json();

      if (!response.ok) {
        const data = await response.json();
        const errorMsg =
          data.error || data.message || "Failed to register user";
        ErrorToast(errorMsg);
      }

      setInProgressOrders(buyInProgressOrders);
      //   return sellOrders;
    } catch (error) {
      console.error("Failed to fetch sell orders:", error);
      return null;
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      // Make an API call to mark all notifications as read
      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/notification/mark-read",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
           body: JSON.stringify({
        userId: user._id, 
        type: "buyOrder", 
        isForAdmin: false,
      }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        // Handle success (for example, reset notifications)
        SuccessToast("All notifications marked as read");
        setNotifications([]); // Clear the notifications or update the state accordingly
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };


  


  async function fetchNotifications() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/notification/unread/user/buyOrders",
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
        if (data.message === "Invalid or expired token") {
          window.location.href = "/signin"; // Adjust path as needed
          return;
        }
        ErrorToast(data.message);
        return;
      }

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

      if (!response.ok) {
        const data = await response.json();
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

  if (loading) return <LoadingSpiner />;

  return (
    <div>
      {/* <div className="block w-full"> */}
      {/* Filters and Export Section */}
      {/* <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button className="py-2 px-4 bg-gray-200 rounded-md">Filters</button>
              <button className="py-2 px-4 bg-gray-200 rounded-md">Export Trades</button>
            </div>
            <div className="flex space-x-4">
              <p className="text-sm">Completed Trades: 0%</p>
              <p className="text-sm">(0 trades out of 0)</p>
            </div>
          </div>
        </div> */}

      {/* </div> */}
      <div className="flex bg-gray-100 pt-2 min-h-screen">
        {/* Main Content Section */}
        <div className="flex-1 p-6 overflow-y-auto">
          <BuyTetherComponent />
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-br from-green-600 via-[#26a17b] to-green-800 text-transparent bg-clip-text mt-5">
              Transaction History
            </h1>

            <div className="space-x-4">
              <button className="bg-gray-200 px-4 py-2 rounded-md">
                Sort By
              </button>
            </div>
          </div>

          <div className="mb-10">
            {inProgressOrders.length !== 0 && (
              <div className="">
                <h2 className="text-xl rounded-2xl shadow-lg py-2 border-slate-400 border font-bold mb-4 bg-slate-200 px-3">
                  My Orders In Progress
                </h2>
                {inProgressOrders.map((offer) => (
                  <UserTradeInProgressCard
                    key={offer._id}
                    offer={offer}
                    showChatButton={offer.status === "On Sale"}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Map Over Offers Data */}

          {loading == false && orders.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              {/* My Past Trades */}
              <div className="text-center text-gray-500 text-2xl">
                <p>You haven’t traded yet or you don't have any sell Order.</p>
                <p className="mt-2 text-gray-600">Start trading now!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl rounded-2xl shadow-lg py-2 border-slate-400 border font-bold mb-4 bg-slate-200 px-3">
                My Orders
              </h2>
              {orders.map((offer, index) => (
                <TradeCard key={index} offer={offer} fetchOrders={fetchBuyOrders} />
              ))}
            </div>
          )}
        </div>
      </div>
      <NotificationPopup
        loading={loadingNotifications}
        notifications={notifications}
        onMarkRead={markNotificationRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </div>
  );
};

export default TradingPage;
