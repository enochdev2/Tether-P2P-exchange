// components/NotificationPopup.js
import React from "react";
import { SuccessToast } from "../utils/Success";
import { useTranslation } from "react-i18next";

const NotificationPopup = ({
  loading = false,
  notifications = [],
  onMarkRead = () => {},
  title = "Unread Notifications",
  onMarkAllAsRead = () => {},
}) => {
  const { t } = useTranslation();
  // Handle the API call for marking all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      // Make the API call to mark all notifications as read
      await onMarkAllAsRead();
      SuccessToast(t("messages.allNotificationsRead"));
    } catch (error) {
      console.error("Error marking all notifications as read", error);
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div
      className=" right-5 sm:right-5 w-80 max-w-[250px] md:max-w-full bg-white border-2 border-red-700 rounded-lg shadow-lg px-2 py-3 md:p-4 z-50"
      style={{ maxHeight: "280px", overflowY: "auto" }}
    >
      {/* Title with Mark All button */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-red-600 md:text-lg text-sm">{title}</h3>
        <button
          onClick={handleMarkAllAsRead}
          className="text-xs bg-green-600 cursor-pointer hover:bg-green-700 text-white py-1 px-3 rounded"
          type="button"
        >
          Mark All
        </button>
      </div>
      {notifications.map((notif) => (
        <div key={notif._id} className="mb-3 p-3 bg-green-50 border border-green-300 rounded">
          <p className=" text-xs md:text-sm mb-2">{notif.message}</p>
          <button
            onClick={() => onMarkRead(notif._id)}
            className="text-xs bg-green-600 hover:bg-green-700 cursor-pointer text-white py-1 px-3 rounded"
            type="button"
          >
            Mark as Read
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationPopup;
