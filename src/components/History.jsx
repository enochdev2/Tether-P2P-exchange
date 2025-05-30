import { ChevronDown } from "lucide-react";
import { useState } from "react";
import BuyTetherComponent from "./BuyTetherComponent";
import TradeCard from "./TradeCard";
import { useEffect } from "react";
import LoadingSpiner from "./LoadingSpiner";

const History = () => {
  const [activeLink, setActiveLink] = useState("findOffers");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  useEffect(() => {
    fetchSellOrders();
  }, []);

  // Function to fetch buy orders, optionally filtered by status
  async function fetchSellOrders(status = "") {
    try {
      // Build the URL with optional status query parameter
      const url = status
        ? `https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/sell-orders?status=${encodeURIComponent(
            status
          )}`
        : "https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/sell-orders";
      // "http://localhost:5173/api/v1/sell/sell-orders";

      // Assuming you have an auth token stored in localStorage or cookie
      // const token = localStorage.getItem("authToken");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/sell-orders",
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
      console.log("Fetched sell orders:", sellOrders);

      const statusPriority = {
        "Pending Approval": 1,
        "On Sale": 2,
        "Sale Completed": 3,
      };

      sellOrders.sort((a, b) => {
        if (statusPriority[a.status] !== statusPriority[b.status]) {
          return statusPriority[a.status] - statusPriority[b.status];
        }
        // If same status, sort by createdAt descending
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setOrders(sellOrders);
      // You can now render buyOrders in your UI
      return sellOrders;
    } catch (error) {
      console.error("Failed to fetch sell orders:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const token = localStorage.getItem("token");
      console.log("🚀 ~ fetchNotifications ~ token:", token)
      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/notification/unread/user/sellOrders",
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

  if (loading) return <LoadingSpiner />;

  const Sell = true;

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
          {/* Map Over Offers Data */}

          {loading == false && !orders ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              {/* My Past Trades */}
              <h2 className="text-xl font-semibold mb-4">My Past Trades</h2>
              <div className="text-center text-gray-500">
                <p>You haven’t traded yet.</p>
                <p className="mt-2 text-gray-600">Start trading now!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((offer, index) => (
                <TradeCard key={index} offer={offer} sell={Sell} />
              ))}
            </div>
          )}
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

export default History;
