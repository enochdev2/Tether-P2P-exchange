import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom"; // Import Outlet for dynamic content rendering
import AlarmBell from "../../components/AlarmBell";
import NotificationPopup from "../../components/NotificationPopup";
import { handleMarkAllAsRead, markNotificationRead } from "../../utils";
import { Bankend_Url, useAuth } from "../../utils/AuthProvider";
import { LongSuccessToast } from "../../utils/LongSuccess";
import Sidebar from "./Sidebar";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { setIsLoggedIn, setUser, user, notifications, setNotifications } = useAuth();
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const navigate = useNavigate();
  const [isOn, setIsOn] = useState(true);

  const playNotificationSound = () => {
    const audio = new Audio("/notification.mp3"); // Replace with actual sound path
    audio.play();
  };

  // Function to fetch notifications based on the type
  const fetchNotifications = async (endpoint) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // const errorMsg = data.error || data.message || "Failed to fetch notifications";
        // ErrorToast(errorMsg);
        return [];
      }

      if (Array.isArray(data) && data.length > 0) {
        LongSuccessToast(`You have a new notification for ${endpoint.split("/").pop()}`);
      }

      return data; // Return data so it can be merged later
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  };

  const markNotifications = async (notificationId) => {
    try {
      const response = await markNotificationRead({ notificationId, setNotifications });

      const data = await response.json();

      return data; // Return data so it can be merged later
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleMarkAllAsReads = async () => {
    try {
      const response = await handleMarkAllAsRead({ setNotifications, isAdmin: true });

      const data = await response.json();

      return data; // Return data so it can be merged later
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  useEffect(() => {
    getUserProfile();
  }, [navigate]);

  useEffect(() => {
    // Example API endpoints for the user and admin notifications
    const userNotifications = [
      `${Bankend_Url}/api/v1/notification/unread/user/sellOrders`,
      `${Bankend_Url}/api/v1/notification/unread/user/buyOrders`,
      `${Bankend_Url}/api/v1/notification/unread/user/registration`,
      `${Bankend_Url}/api/v1/notification/unread/user/inquiry`,
    ];

    const adminNotifications = [
      `${Bankend_Url}/api/v1/notification/unread/sellOrders`,
      `${Bankend_Url}/api/v1/notification/unread/buyOrders`,
      `${Bankend_Url}/api/v1/notification/unread/chatSession`,
      `${Bankend_Url}/api/v1/notification/unread/registration`,
    ];

    // Assuming you have some way to differentiate the user's role (e.g., `isAdmin` flag)
    const isUserAdmin = true; // You can replace this with actual user role logic

    // Decide which set of notifications to fetch based on the user's role
    const notificationsToFetch = isUserAdmin ? adminNotifications : userNotifications;

    // Fetch notifications concurrently
    const fetchAllNotifications = async () => {
      setLoadingNotifications(true);
      try {
        const fetchedNotifications = await Promise.all(
          notificationsToFetch.map((url) => fetchNotifications(url))
        );

        // Merge all fetched notifications into one array
        const allNotifications = fetchedNotifications.flat(); // Flatten the array if it's an array of arrays
        // Get the last count from localStorage before update
        const newCount = allNotifications?.length;
        const lastCounts = JSON.parse(localStorage.getItem("notifications"));
        const lastCount = lastCounts?.length;

        if (newCount > lastCount) {
          playNotificationSound();
          LongSuccessToast(`You have ${newCount - lastCount} new notifications`);

          // Only play sound if the new count is greater than the old count
        }
        localStorage.setItem("notifications", JSON.stringify(allNotifications));
        setNotifications(allNotifications); // Update state with all notifications
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchAllNotifications();
    // Set an interval to fetch notifications every 10 seconds
    const intervalId = setInterval(fetchAllNotifications, 300000);

    // Cleanup the interval on component unmount or route change
    return () => clearInterval(intervalId);
  }, [navigate]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

    if (storedUser && storedIsLoggedIn === "true") {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);

      // Redirect non-admin users
      if (!parsedUser.admin) {
        navigate("/");
      }
    } else {
      // Not logged in
      navigate("/login");
    }
  }, [navigate]);

  const getUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("🚀 ~ getUserProfile ~ user.nickname:", user?.nickname); // `http://localhost:3000/api/v1/user/users/${updatedData.nickname}`,
      const response = await fetch(`${Bankend_Url}/api/v1/user/users/${user?.nickname}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        const errorMsg = data.error || data.message || "Failed to register user";
        if (errorMsg === "Invalid or expired token") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("isLoggedIn");
          navigate("/signin");
        }
        // ErrorToast(errorMsg);
      }

      const data = await response.json();
      // console.log("🚀 ~ getUserProfile12345678890-=-=-=-=-=- ~ data:", data);

      return data; // Return updated user data
    } catch (error) {
      console.error("Error during user update:", error);
    }
  };

  return (
    <div className="flex mt-19 min-h-screen bg-gray-100 overflow-x-auto">
      {/* Sidebar Section */}
      <div className=" bg-white shadow-md">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1  p-4 sm:p-6 lg:p-8 space-y-4 overflow-y-auto">
        {/* Header */}
        <div className="border-b flex items-center px-2 sm:px-3 py-3 border-slate-300 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold">{t("AdminDashboard")}</h1>
        </div>

        {/* Dynamic Content Rendering */}
        <Outlet />
      </div>
      <div className="fixed bottom-6 right-6 z-50 flex items-end  gap-x-1 ">
        {/* Your dashboard content here */}
        {isOn && (
          <NotificationPopup
            loading={loadingNotifications}
            notifications={notifications}
            onMarkRead={markNotifications}
            onMarkAllAsRead={handleMarkAllAsReads}
          />
        )}
        <AlarmBell setIsOn={setIsOn} isOn={isOn} />
      </div>
    </div>
  );
};

export default AdminDashboard;
