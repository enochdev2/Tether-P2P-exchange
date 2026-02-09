import React, { useEffect, useState } from "react";
import { LongSuccessToast, ErrorToast } from "../../utils/LongSuccess";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

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
        return;
      }

      if (Array.isArray(data) && data.length > 0) {
        LongSuccessToast(`You have a new notification for ${endpoint.split('/').pop()}`);
      }

      setNotifications(data); // Update notifications state
    } catch (error) {
      console.error("Error fetching notifications:", error);
      ErrorToast("An error occurred while fetching notifications.");
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    // Example API endpoints for the user and admin notifications
    const userNotifications = [
      "https://tether-p2-p-exchang-backend.vercel.app/api/v1/notification/unread/user/sellOrders",
      "https://tether-p2-p-exchang-backend.vercel.app/api/v1/notification/unread/user/buyOrders",
      "https://tether-p2-p-exchang-backend.vercel.app/api/v1/notification/unread/user/registration",
      "https://tether-p2-p-exchang-backend.vercel.app/api/v1/notification/unread/user/inquiry",
    ];

    const adminNotifications = [
      "https://tether-p2-p-exchang-backend.vercel.app/api/v1/notification/unread/sellOrders",
      "https://tether-p2-p-exchang-backend.vercel.app/api/v1/notification/unread/buyOrders",
      "https://tether-p2-p-exchang-backend.vercel.app/api/v1/notification/unread/chatSession",
      "https://tether-p2-p-exchang-backend.vercel.app/api/v1/notification/unread/registration",
    ];

    // Assuming you have some way to differentiate the user's role (e.g., `isAdmin` flag)
    const isUserAdmin = false; // You can replace this with actual user role logic

    // Fetch notifications based on user role
    if (isUserAdmin) {
      adminNotifications.forEach((url) => fetchNotifications(url));
    } else {
      userNotifications.forEach((url) => fetchNotifications(url));
    }
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      {loadingNotifications ? (
        <p>Loading notifications...</p>
      ) : (
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>{notification.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
