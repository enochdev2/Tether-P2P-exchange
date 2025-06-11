// utils/markNotifications.js
export const markAllNotificationsAsRead = async ({
  userId,
  type = "registration",
  isForAdmin = false,
  token,
}) => {
  try {
    const response = await fetch(
      "https://tether-p2p-exchang-backend.onrender.com/api/v1/notification/mark-read",
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
