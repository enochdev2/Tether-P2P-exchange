import React, { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { CheckCircle, Shield, Phone, ShieldAlertIcon } from "lucide-react";
import { useAuth } from "../../utils/AuthProvider";
import InfoCard from "../../components/InfoCard";

function Dashboard() {
  const { user, setIsLoggedIn, setUser } = useAuth();
  const navigate = useNavigate();

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
    <div className="flex min-h-screen pt-18 bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Content Area */}
      <div className="w-3/4 p-6 overflow-y-hidden ">
        {/* Dashboard Header */}
        <div className="flex space-x-4 mb-6 mx-auto justify-center">
          {/* Phone Verified */}
          <div className="flex items-center bg-white shadow-md rounded-md px-6 py-3 space-x-2">
            <InfoCard
              icon={
                <CheckCircle className="w-8 h-8 bg-green-500 text-white rounded-full p-1" />
              }
              title="Account Level: 1"
              actionText=""
              onAction={() => console.log("Redirect to 2FA setup")}
            />
          </div>
          <div className="flex items-center bg-white shadow-md rounded-md px-6 py-3 space-x-2">
            <InfoCard
              icon={
                <Phone className="w-8 h-8 bg-green-500 text-white rounded-full p-1" />
              }
              title="You're Phone Verified"
              actionText="Phone Number Verified"
              onAction={() => console.log("Redirect to 2FA setup")}
            />
          </div>

          <div className="flex items-center bg-white shadow-md rounded-md px-6 py-3 space-x-2">
            <InfoCard
              icon={
                <Shield className="w-8 h-8 bg-red-500 text-white rounded-full p-1" />
              }
              title="2FA Not Enabled"
              actionText="Setup 2FA"
              onAction={() => console.log("Redirect to 2FA setup")}
            />
          </div>

          {/* 2FA Not Enabled */}
        </div>
        {/* Render nested components */}
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
