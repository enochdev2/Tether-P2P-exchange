import React, { useEffect, useState } from "react";
import ProfileCard from "../../components/ProfileCard";
import InfoCard from "../../components/InfoCard";
import AccountSetting from "../../components/AccountSetting";
import ProfileSetting from "../../components/ProfileSetting";
import {
  Banknote,
  BanknoteIcon,
  PiggyBank,
  ShieldAlertIcon,
  Wallet2Icon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthProvider";
import NotificationPopup from "../../components/NotificationPopup";
import { SuccessToast } from "../../utils/Success";

function ProfileOverview() {
  const { user, setIsLoggedIn, setUser } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

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
  }, [navigate]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const token = localStorage.getItem("token");
      console.log("🚀 ~ fetchNotifications ~ token:", token);
      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/notification/unread/user/registration",
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
      console.log("🚀 ~ fetchNotifications ~ data:", data);
      if(data){
        SuccessToast("you have a new notification message")
      }
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

      console.log("🚀 ~ markNotificationRead ~ response:", response);
      // Remove the marked notification from state so the card disappears
      setNotifications((prev) =>
        prev.filter((notif) => notif._id !== notificationId)
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }

  const tether = `Wallet Address:  ${user?.tetherAddress}`;

  return (
    <div className="w-full space-y-6">
      <div className="w-full md:w-[90%] mx-auto space-y-6">
        <div className=" mt-4 "></div>

        <ProfileCard user={user} />
        <ProfileSetting user={user} />

        <InfoCard
          icon={<Wallet2Icon size={24} />}
          title={tether}
          // actionText="Set answers"
          // onAction={() => console.log("Navigate to security questions")}
        />
        <div className="flex gap-4 w-full lg:space-x-6 my-4 overflow-x-auto sm:overflow-visible">
          <div className="min-w-[280px] sm:min-w-0 flex-1">
            <InfoCard
              icon={<PiggyBank size={24} />}
              title="Bank Name"
              actionText={user?.bankName}
              onAction={() => console.log("Navigate to security questions")}
            />
          </div>
          <div className="min-w-[280px] sm:min-w-0 flex-1">
            <InfoCard
              icon={<BanknoteIcon size={24} />}
              title="Bank Account Number"
              actionText={user?.bankAccount}
              onAction={() => console.log("Navigate to security questions")}
            />
          </div>
          <div className="min-w-[280px] sm:min-w-0 flex-1">
            <InfoCard
              icon={<BanknoteIcon size={24} />}
              title=""
              // actionText={user?.bankAccount}
              onAction={() => console.log("Navigate to security questions")}
            />
          </div>
          {/* <InfoCard /> */}
        </div>
      </div>
      <NotificationPopup
        loading={loadingNotifications}
        notifications={notifications}
        onMarkRead={markNotificationRead}
      />
    </div>
  );
}

export default ProfileOverview;
