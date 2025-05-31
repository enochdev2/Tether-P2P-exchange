import React, { use, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom"; // Import Outlet for dynamic content rendering
import Sidebar from "./Sidebar";
import { useAuth } from "../../utils/AuthProvider";
import InfoCard from "../../components/InfoCard";
import { SettingsIcon, User2 } from "lucide-react";
import UsersCard from "../../components/UsersCard";
import DashboardMetrics from "../../components/DashboardMetrics";

const AdminDashboard = () => {
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
    <div className="flex min-h-screen bg-gray-100 pt-18">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 p-8 space-y-5">
        <div className="border-b flex px-3  items-center border-slate-300 shadow-xs">
        <h1 className="text-3xl font-bold mb-6 ">Admin Dashboard</h1>
        </div>
        {/* <UsersCard users={users} Icon={User2} /> */}
        {/* Dynamic Content Rendering */}
        <Outlet />{" "}
        {/* This is where the child routes' components will be rendered */}
      </div>
    </div>
  );
};

export default AdminDashboard;
