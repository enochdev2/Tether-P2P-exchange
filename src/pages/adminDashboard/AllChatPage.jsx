import { useEffect, useState } from "react";
import { FaArrowRight, FaComments } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NotificationPopup from "../../components/NotificationPopup";
import { ErrorToast } from "../../utils/Error";

const AllChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch(
        `https://tether-p2p-exchang-backend.onrender.com/api/v1/chat/allchat`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        const data = await res.json();
        const errorMsg =
          data.error || data.message || "Failed to register user";
        ErrorToast(errorMsg);
      }

      setMessages(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/notification/unread/chatSession",
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
        const data = await res.json();
        const errorMsg =
          data.error || data.message || "Failed to register user";
        ErrorToast(errorMsg);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-md shadow-xl rounded-3xl p-8 border border-green-200">
        <div className="flex items-center gap-3 mb-6">
          <FaComments className="text-green-600 text-3xl" />
          <h2 className="text-3xl font-bold text-green-800">
            Open Chat Sessions
          </h2>
        </div>

        <p className="text-gray-700 mb-6">
          Click any active Order ID below to jump into its chatroom and continue
          the conversation.
        </p>

        {messages.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">🚫 No active chat sessions yet.</p>
            <p className="mt-2">
              Once an order is active, chats will show here.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-1 gap-4">
            {messages.map((chat) => (
              <li
                key={chat._id}
                onClick={() => navigate(`/chat/${chat.orderId}`)}
                className="cursor-pointer bg-white rounded-xl border border-green-300 shadow-md p-5 hover:bg-green-100 transition-all duration-200 ease-in-out flex justify-between items-center"
              >
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="text-lg font-semibold text-green-800">
                    {chat.orderId}
                  </p>
                </div>
                <FaArrowRight className="text-green-600 text-xl" />
              </li>
            ))}
          </ul>
        )}

        {/* Optional static footer or notice */}
        <div className="mt-10 text-center text-sm text-gray-500">
          <p>Need help? Contact support or visit the admin panel.</p>
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

export default AllChatPage;
