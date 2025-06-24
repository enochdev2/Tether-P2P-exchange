import { Bell, BellOff } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";

const AlarmBell = () => {
  const { notifications, setNotifications } = useAuth();
  const [isOn, setIsOn] = useState(true);
  // const [notificationCount] = useState(notifications.lenght); // Example count
   // Function to play notification sound
 
  // Correcting the typo and using notifications.length directly
  const notificationCount = notifications.length;
  
  //  notificationCount > 0 && playNotificationSound();
  const toggleAlarm = () => {
    setIsOn((prev) => !prev);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 cursor-pointer" onClick={toggleAlarm}>
      <div className="relative bg-green-200 p-3 rounded-full shadow-lg  transition">
        {/* Icon */}
        {isOn ? (
          <Bell className="text-yellow-600 w-6 h-6" />
        ) : (
          <BellOff className="text-yellow-600  w-6 h-6" />
        )}

        {/* Notification Badge */}
        {notificationCount > 0 && isOn && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
            {notificationCount}
          </span>
        )}
      </div>
    </div>
  );
};

export default AlarmBell;
