import { ChevronDown } from "lucide-react";
import { useState } from "react";
import BuyTetherComponent from "./BuyTetherComponent";
import TradeCard from "./TradeCard";
import { useEffect } from "react";
import LoadingSpiner from "./LoadingSpiner";
import NotificationPopup from "./NotificationPopup";
import UserTradeInProgressCard from "../pages/dashboard/UserTradeInProgressCard";

const History = () => {
  const [activeLink, setActiveLink] = useState("findOffers");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [inProgressOrders, setInProgressOrders] = useState([]);

  useEffect(() => {
    fetchInProgressOrders();
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

  async function fetchInProgressOrders() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/user/inProgress-orders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const sellInProgressOrders = await response.json();
      console.log("🚀 INPROGRESSsaleOrders:", sellInProgressOrders);

      setInProgressOrders(sellInProgressOrders);
      //   return sellOrders;
    } catch (error) {
      console.error("Failed to fetch sell orders:", error);
      return null;
    }
  }

  async function fetchNotifications() {
    try {
      const token = localStorage.getItem("token");
      console.log("🚀 ~ fetchNotifications ~ token:", token);
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
                    sell={Sell}
                    showChatButton={offer.status === "On Sale"}
                    onChatClick={() => navigate(`/admin/chat/${offer._id}`)}
                  />
                ))}
              </div>
            )}
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
              <h2 className="text-xl rounded-2xl shadow-lg py-2 border-slate-400 border font-bold mb-4 bg-slate-200 px-3">
                  My Orders
                </h2>
              {orders.map((offer, index) => (
                <TradeCard key={index} offer={offer} sell={Sell} />
              ))}
            </div>
          )}
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

export default History;
