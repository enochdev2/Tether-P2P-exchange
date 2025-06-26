import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";
import InfoCard from "../../components/InfoCard";
import { useAuth } from "../../utils/AuthProvider";
import Sidebar from "./Sidebar";
// import io from "socket.io-client";
import { ErrorToast } from "../../utils/Error";
import { LongSuccessToast } from "../../utils/LongSuccess";
import AlarmBell from "../../components/AlarmBell";
import NotificationPopup from "../../components/NotificationPopup";
import { handleMarkAllAsRead, markNotificationRead } from "../../utils";

function Dashboard() {
  const { t } = useTranslation();
  const { user, setIsLoggedIn, setUser, notifications, setNotifications, isTokenExpired } =
    useAuth();
  const navigate = useNavigate();
  // console.log("🚀 ~ Dashboard ~ notifications:", notifications);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
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
        const errorMsg = data.error || data.message || "Failed to fetch notifications";
        ErrorToast(errorMsg);
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
      const response = await handleMarkAllAsRead({ setNotifications, isAdmin: false });

      const data = await response.json();

      return data; // Return data so it can be merged later
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    // Example API endpoints for the user and admin notifications
    const userNotifications = [
      "https://tether-p2p-exchang-backend.onrender.com/api/v1/notification/unread/user/sellOrders",
      "https://tether-p2p-exchang-backend.onrender.com/api/v1/notification/unread/user/buyOrders",
      "https://tether-p2p-exchang-backend.onrender.com/api/v1/notification/unread/user/registration",
      "https://tether-p2p-exchang-backend.onrender.com/api/v1/notification/unread/user/inquiry",
    ];

    const adminNotifications = [
      "https://tether-p2p-exchang-backend.onrender.com/api/v1/notification/unread/sellOrders",
      "https://tether-p2p-exchang-backend.onrender.com/api/v1/notification/unread/buyOrders",
      "https://tether-p2p-exchang-backend.onrender.com/api/v1/notification/unread/chatSession",
      "https://tether-p2p-exchang-backend.onrender.com/api/v1/notification/unread/registration",
    ];

    // Assuming you have some way to differentiate the user's role (e.g., `isAdmin` flag)
    const isUserAdmin = false; // You can replace this with actual user role logic

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
        const newCount = allNotifications.length;
        const lastCounts = JSON.parse(localStorage.getItem("notifications"));
        const lastCount = lastCounts.length;
        console.log("🚀 ~ fetchAllNotifications ~ lastCount:", lastCount);

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
    const intervalId = setInterval(fetchAllNotifications, 3000);

    // Cleanup the interval on component unmount or route change
    return () => clearInterval(intervalId);
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (isTokenExpired(token)) {
      localStorage.removeItem("token");
      navigate("/signin"); // force logout
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

    if (storedUser && storedIsLoggedIn === "true") {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    } else {
      ("isLoggedIn");
      if (!user) {
        navigate("/");
      }
    }
  }, []);

  return (
    <div className=" relative flex min-h-screen pt-18 bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Content Area */}
      <div className="lg:w-3/4 lg:p-6 overflow-y-hidden ">
        {/* Dashboard Header */}
        <div className="w-full px-4 py-6 bg-gray-50">
          <div className="w-full flex justify-center">
            <div className="flex justify-center ">
              <div className=" min-w-0 mx-auto">
                <InfoCard
                  icon={<CheckCircle className="w-6 h-6" />}
                  title={t("AccountLevel")}
                  children={t("LevelPrepared")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Render nested components */}
        <Outlet />

        {/* Render Notifications */}
        {/* <div className="mt-4">
          {notifications?.map((notification, index) => (
            <div key={index} className="bg-blue-200 p-4 rounded-md mb-2">
              {notification}
            </div>
          ))}
        </div> */}
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
}

export default Dashboard;
