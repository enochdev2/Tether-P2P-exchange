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
