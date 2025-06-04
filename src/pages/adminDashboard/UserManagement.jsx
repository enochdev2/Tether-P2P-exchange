import { UserPlus2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import AdminTradeCard2 from "../../components/AdminTradeCard2";
import AdminUserCard from "../../components/AdminUserCard";
import LoadingSpiner from "../../components/LoadingSpiner";
import NotificationPopup from "../../components/NotificationPopup";
import { useAuth } from "../../utils/AuthProvider";
import { ErrorToast } from "../../utils/Error";
import { SuccessToast } from "../../utils/Success";

const UserManagement = () => {
  const [loadingSell, setLoadingSell] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [change, setChange] = useState(true);
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



  if (loadingSell) return <LoadingSpiner />;

  const Sell = true;

  return (
    <div>
      <div className="flex bg-gray-100 pt-2 min-h-screen">
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6 border bg-slate-200 border-slate-300 px-4 py-3 md:mb-12 rounded-2xl ">
            <div className=" px-5 py-2 rounded-2xl ">
              <h1 className="text-3xl font-bold bg-gradient-to-br flex from-green-600 via-[#26a17b] to-green-800 items-center text-transparent bg-clip-text ">
                <UserPlus2Icon className="text-green-600 mr-5" /> User
                Management
              </h1>
            </div>
          </div>

          {/* Render All Users */}
          <div className="mb-2">
            <h2 className="text-xl font-semibold mb-4">All Users</h2>
            {allUsers?.length === 0 ? (
              <p className="text-gray-500">No  User Available.</p>
            ) : (
              allUsers?.map((offer) => (
                <AdminUserCard
                  key={offer._id}
                  offer={offer}
                  handleSubmit={() => handleSubmit(offer.nickname)}
                  setChange={setChange}
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

export default UserManagement;
//  {index === 0 ? fmt(metric.value) : `$ ${fmt(metric.value)}`}