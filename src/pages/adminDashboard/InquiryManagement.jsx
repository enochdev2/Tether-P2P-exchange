import { useEffect, useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import AdminInquiryCard from "../../components/AdminInquiryCard";
import LoadingSpiner from "../../components/LoadingSpiner";
import NotificationPopup from "../../components/NotificationPopup";
import { ErrorToast } from "../../utils/Error";

const InquiryManagement = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [sellOrders, setSellOrders] = useState([]);
  const [loadingSell, setLoadingSell] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [allUsers, setAllUsers] = useState([]);

  const [sellAmountFilter, setSellAmountFilter] = useState("all");

  useEffect(() => {
    fetchNotifications();
    allUser();
  }, []);

  const allUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/inquiry/all/active",
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

      setAllUsers(data); // return parsed user data
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingSell(false);
    }
  };

  async function fetchNotifications() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/notification/unread/inquiry",
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

   const sortedOffers = allUsers.sort((a, b) => {
      // First, prioritize posts without comments
      if (!a.comment && b.comment) return -1; // a should come first if a doesn't have a comment
      if (a.comment && !b.comment) return 1; // b should come first if b doesn't have a comment

      // If both have comments or both don't have comments, sort by creation date (oldest first)
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

  if (loadingSell) return <LoadingSpiner />;

  const Sell = true;

  return (
    <div>
      <div className="flex bg-gray-100 pt-2 min-h-screen">
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6 border bg-slate-200 border-slate-300 px-4 py-3 md:mb-12 rounded-2xl ">
            <div className=" px-5 py-2 rounded-2xl ">
              <h1 className="text-3xl font-bold bg-gradient-to-br flex from-green-600 via-[#26a17b] to-green-800 items-center text-transparent bg-clip-text ">
                <FaQuestionCircle className="text-green-600 mr-5" /> All
                Inquries Management
              </h1>
            </div>
          </div>

          {/* Render Sell Orders */}
          <div className="mb-5 md:text-xl ">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              All Inquiries
            </h2>
            <div className="flex justify-between sm:space-x-1 items-center text-white bg-[#26a17b] px-5 py-2">
              <div className="">
                Title
              </div>
              <div className="">
                Nickname
              </div>

              <div className="">
                Description
              </div>
              <div>Comment</div>
              <div className="">Action...</div>
              <div>status</div>
            </div>
            {allUsers?.length === 0 ? (
              <p className="text-gray-500">No User Available.</p>
            ) : (
              sortedOffers?.map((offer) => (
                <AdminInquiryCard
                  key={offer._id}
                  offer={offer}
                  sell={Sell}
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

export default InquiryManagement;
