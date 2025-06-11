import { UserPlus2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import AdminTradeCard2 from "../../components/AdminTradeCard2";
import AdminUserCard from "../../components/AdminUserCard";
import LoadingSpiner from "../../components/LoadingSpiner";
import NotificationPopup from "../../components/NotificationPopup";
import { useAuth } from "../../utils/AuthProvider";
import { ErrorToast } from "../../utils/Error";
import { SuccessToast } from "../../utils/Success";
import { markAllNotificationsAsRead } from "../../utils";

const UserManagement = () => {
  const [loadingSell, setLoadingSell] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [change, setChange] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // const { allUser } = useAuth();
  const { updateUser, setUser } = useAuth();

  const allUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/user/users",
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
  useEffect(() => {
    allUser();
  }, []);

  const handleSubmit = async (nickname) => {
    let updatedUser;
    if (change) {
      updatedUser = {
        nickname: nickname,
        status: "active",
        // admin: user?.admin || false, // preserve existing admin status
      };
    } else {
      updatedUser = {
        nickname: nickname,
        status: "inactive",
        // admin: user?.admin || false, // preserve existing admin status
      };
    }

    try {
      const response = await updateUser(updatedUser);
      if (response) {
        SuccessToast("You have successfully updated the status");
        allUser();
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      ErrorToast(`something went wrong ${error}`);
      // Optionally handle error here (e.g., show error message)
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/notification/unread/registration",
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

      if (!response.ok) throw new Error("Failed to mark notification as read");

      // Remove the marked notification from state so the card disappears
      setNotifications((prev) =>
        prev.filter((notif) => notif._id !== notificationId)
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }

  const handleMarkAllAsRead = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    const { success, error } = await markAllNotificationsAsRead({
      userId: user._id,
      type: "registration", // or another type
      isForAdmin: true, // or false depending on the context
      token,
    });

    if (success) {
      SuccessToast("All notifications marked as read");
      setNotifications([]); // or any state update
    } else {
      console.error(error);
    }
  };

  const filteredUsers = allUsers.filter((user) =>
    user.nickname?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loadingSell) return <LoadingSpiner />;

  const Sell = true;

  return (
    <div>
      <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-12">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 sm:p-6 rounded-xl shadow-md mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-3 mb-3 sm:mb-0">
            <UserPlus2Icon className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
            <span className="bg-gradient-to-r from-green-600 via-[#26a17b] to-green-800 text-transparent bg-clip-text">
              User Management
            </span>
          </h1>

          <button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 transition text-white font-medium px-5 py-2 rounded-md shadow">
            All Users
          </button>
        </header>

        {/* Search Section */}
        <div className="mb-6">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user by name..."
              className="w-full border border-gray-300 px-4 py-3 pr-10 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
          </div>
        </div>

        {/* User Cards Grid */}
        <section className="">
          {allUsers?.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-10">
              No users available.
            </div>
          ) : (
            filteredUsers?.map((offer) => (
              <AdminUserCard
                key={offer._id}
                offer={offer}
                handleSubmit={() => handleSubmit(offer.nickname)}
                setChange={setChange}
                handleUpdate={allUser}
              />
            ))
          )}
        </section>
      </div>

      {/* Notification Alert Box */}
      <NotificationPopup
        loading={loadingNotifications}
        notifications={notifications}
        onMarkRead={markNotificationRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </div>
  );
};

export default UserManagement;
//  {index === 0 ? fmt(metric.value) : `$ ${fmt(metric.value)}`}
