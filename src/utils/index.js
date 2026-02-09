import { ErrorToast } from "./Error";

// utils/markNotifications.js
export const markAllNotificationsAsRead = async ({
  userId,
  type = "registration",
  isForAdmin = false,
  token,
}) => {
  try {
    const response = await fetch(
      "https://tether-p2-p-exchang-backend.vercel.app/api/v1/notification/mark-read",
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          type,
          isForAdmin,
        }),
      }
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Failed to mark notifications as read");
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return { success: false, error };
  }
};

export async function markNotificationRead({ notificationId, setNotifications }) {
  console.log("🚀 ~ markNotificationRead ~ notificationId:", notificationId);
  try {
    const token = localStorage.getItem("token");
    // `https://tether-p2-p-exchang-backend.vercel.app/api/v1/notification/mark-read/${notificationId}`,
    const response = await fetch(
      `https://tether-p2-p-exchang-backend.vercel.app/api/v1/notification/mark-read/${notificationId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      const errorMsg = data.error || data.message || "Failed to register user";
      // ErrorToast(errorMsg);
      return;
    }

    setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId));
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
}

 export const handleMarkAllAsRead = async ({setNotifications, isAdmin}) => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      // Make an API call to mark all notifications as read
      const response = await fetch(
        "https://tether-p2-p-exchang-backend.vercel.app/api/v1/notification/mark-read",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user._id,
            isForAdmin: isAdmin,
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        // Handle success (for example, reset notifications)
        // SuccessToast("All notifications marked as read");
        setNotifications([]); // Clear the notifications or update the state accordingly
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };
