import React, { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { CheckCircle, Shield, Phone, ShieldAlertIcon } from "lucide-react";
import { useAuth } from "../../utils/AuthProvider";
import InfoCard from "../../components/InfoCard";
import { LongSuccessToast } from "../../utils/LongSuccess";

function Dashboard() {
  const { user, setIsLoggedIn, setUser, isTokenExpired } = useAuth();
  const navigate = useNavigate();
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

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/notification/unread/user/buyOrders",
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
        const data = await response.json();
        if (data.message === "Invalid or expired token") {
          // Redirect to sign-in page if token is invalid or expired
          window.location.href = "/signin"; // Adjust path as needed
          return;
        }
        ErrorToast(data.message);
        return;
      }

      if (Array.isArray(data) && data.length > 0) {
        LongSuccessToast("You have a new notification message on buy order");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }

  return (
    <div className="flex min-h-screen pt-18 bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Content Area */}
      <div className="lg:w-3/4 lg:p-6 overflow-y-hidden ">
        {/* Dashboard Header */}
        <div className="w-full px-4 py-6 bg-gray-50">
          <div className="flex sm:grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto overflow-x-auto sm:overflow-visible">
            <div className="min-w-[280px] sm:min-w-0">
              <InfoCard
                icon={<CheckCircle className="w-6 h-6" />}
                title="Account Level: 1"
              />
            </div>

            <div className="min-w-[280px] sm:min-w-0">
              <InfoCard
                icon={<Phone className="w-6 h-6" />}
                title="You're Phone Verified"
                actionText="Phone Number Verified"
                onAction={() => console.log("Redirect to phone setup")}
              />
            </div>

            <div className="min-w-[280px] sm:min-w-0">
              <InfoCard
                icon={<Shield className="w-6 h-6" />}
                title="2FA Not Enabled"
                actionText="Setup 2FA"
                onAction={() => console.log("Redirect to 2FA setup")}
              />
            </div>
          </div>
        </div>

        {/* Render nested components */}
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
