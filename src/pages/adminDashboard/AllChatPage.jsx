import { useEffect, useState } from "react";
import { FaArrowRight, FaComments } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NotificationPopup from "../../components/NotificationPopup";
import { ErrorToast } from "../../utils/Error";
import { markAllNotificationsAsRead } from "../../utils";
import { SuccessToast } from "../../utils/Success";
import { useTranslation } from "react-i18next";

const AllChatPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [selectedTab, setSelectedTab] = useState("Seller"); // State for Seller/Buyer tab
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

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
        const errorMsg =
          data.error || data.message || "Failed to fetch messages";
        ErrorToast(errorMsg);
        return;
      }

      setMessages(data);
      setFilteredMessages(data); // Initially show all messages
    } catch (err) {
      console.error("Error fetching messages:", err.message);
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
        const errorMsg =
          data.error || data.message || "Failed to fetch notifications";
        ErrorToast(errorMsg);
        return;
      }

      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  }

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    filterMessages(tab); // Filter messages when tab changes
  };

  const filterMessages = (tab) => {
    // Filter based on orderType (buy or sell)
    if (tab === "Seller") {
      setFilteredMessages(messages.filter((msg) => msg.orderType === "sell")); // Filter for sell orders
    } else {
      setFilteredMessages(messages.filter((msg) => msg.orderType === "buy")); // Filter for buy orders
    }
  };

  const handleSearch = () => {
    if (searchQuery) {
      const filtered = messages.filter((msg) =>
        msg.orderId.includes(searchQuery)
      );
      setFilteredMessages(filtered); // Show messages that match the order number
    } else {
      setFilteredMessages(messages); // Show all messages if search query is empty
    }
  };

  const markNotificationRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
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

      setNotifications((prev) =>
        prev.filter((notif) => notif._id !== notificationId)
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  


const handleMarkAllAsRead = async () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const { success, error } = await markAllNotificationsAsRead({
    userId: user._id,
    type: "chat", // or another type
    isForAdmin: true,     // or false depending on the context
    token,
  });

  if (success) {
    SuccessToast("All notifications marked as read");
    setNotifications([]); // or any state update
  } else {
    console.error(error);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-md shadow-xl rounded-3xl p-8 border border-green-200">
        <div className="flex items-center gap-3 mb-6">
          <FaComments className="text-green-600 text-3xl" />
          <h2 className="text-3xl font-bold text-green-800">{t("chat.title")}</h2>
        </div>

        <p className="text-gray-700 mb-6">{t("chat.description")}</p>

        <div className="flex gap-4 mb-6">
          <div className="flex flex-1 space-x-3">
            <button
              onClick={() => handleTabChange("Seller")}
              className={`px-4 w-[50%] h-12 cursor-pointer py-2 rounded-lg text-white ${
                selectedTab === "Seller" ? "bg-green-600" : "bg-green-300"
              }`}
            >
              {t("chat.seller")}
            </button>
            <button
              onClick={() => handleTabChange("Buyer")}
              className={`px-4 w-[50%] h-12 cursor-pointer py-2 rounded-lg text-white ${
                selectedTab === "Buyer" ? "bg-green-600" : "bg-green-300"
              }`}
            >
              {t("chat.buyer")}
            </button>
          </div>
          <div className="flex flex-1 items-center mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("chat.searchPlaceholder")}
              className="p-2 border rounded-lg w-full mr-2"
            />
            <button onClick={handleSearch} className="bg-green-600 text-white px-4 py-2 rounded-lg">
              {t("chat.search")}
            </button>
          </div>
        </div>

        {filteredMessages.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">{t("chat.noChatsTitle")}</p>
            <p className="mt-2">{t("chat.noChatsDescription")}</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-1 gap-4">
            {filteredMessages.map((chat) => (
              <li
                key={chat._id}
                onClick={() => navigate(`/chats/${chat.orderType}/${chat.orderId}`)}
                className="cursor-pointer bg-white rounded-xl border border-green-300 shadow-md p-5 hover:bg-green-100 transition-all duration-200 ease-in-out flex justify-between items-center"
              >
                <div>
                  <p className="text-sm text-gray-500">{t("chat.orderIdLabel")}</p>
                  <p className="text-lg font-semibold text-green-800">{chat.orderId}</p>
                </div>
                <div className="flex space-x-10 items-center">
                  <p className="text-lg font-semibold text-green-800 bg-green-50 px-3 py-3 rounded-lg">
                    {chat?.nickname}
                  </p>
                  <FaArrowRight className="text-green-600 text-xl" />
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 text-center text-sm text-gray-500">
          <p>{t("chat.supportNote")}</p>
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

export default AllChatPage;
