import React, { use, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom"; // Import Outlet for dynamic content rendering
import Sidebar from "./Sidebar";
import { useAuth } from "../../utils/AuthProvider";
import InfoCard from "../../components/InfoCard";
import { SettingsIcon, User2 } from "lucide-react";
import UsersCard from "../../components/UsersCard";
import DashboardMetrics from "../../components/DashboardMetrics";
import { useTranslation } from "react-i18next";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user, setIsLoggedIn, setUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 6577,
    totalSales: 1576,
    totalBuys: 6557,
    totalFees: 45345,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

    if (storedUser && storedIsLoggedIn === "true") {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);

      // Redirect non-admin users
      if (!parsedUser.admin) {
        navigate("/"); 
      }
    } else {
      // Not logged in
      navigate("/login"); 
    }
  }, [navigate]);

  useEffect(() => {
    // Replace with real-time fetch or WebSocket subscription
    fetch("/api/admin/metrics")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  return (
    <div className="flex mt-19 min-h-screen bg-gray-100 overflow-x-auto">
      {/* Sidebar Section */}
      <div className=" bg-white shadow-md">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1  p-4 sm:p-6 lg:p-8 space-y-4 overflow-y-auto">
        {/* Header */}
        <div className="border-b flex items-center px-2 sm:px-3 py-3 border-slate-300 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold">{t("AdminDashboard")}</h1>
        </div>

        {/* Dynamic Content Rendering */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
