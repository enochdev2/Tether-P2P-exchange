// components/NotificationPopup.js
import React from "react";

const NotificationPopup = ({
  loading = false,
  notifications = [],
  onMarkRead = () => {},
  title = "Unread Notifications",
}) => {
  if (loading || notifications.length === 0) return null;

  return (
    <div
      className="fixed bottom-1 md:bottom-5 right-1 sm:right-5 w-80 max-w-[280px] md:max-w-full bg-white border-2 border-red-700 rounded-lg shadow-lg px-2 py-3 md:p-4 z-50"
      style={{ maxHeight: "400px", overflowY: "auto" }}
    >
      <h3 className="font-semibold mb-2 text-red-600 md:text-lg text-sm">{title}</h3>

      {notifications.map((notif) => (
        <div
          key={notif._id}
          className="mb-3 p-3 bg-green-50 border border-green-300 rounded"
        >
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
