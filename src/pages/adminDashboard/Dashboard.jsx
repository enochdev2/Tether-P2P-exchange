import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardMetrics from "../../components/DashboardMetrics";
import { useAuth } from "../../utils/AuthProvider";
import Sidebar from "./Sidebar";
import { LongSuccessToast } from "../../utils/LongSuccess";
import { ErrorToast } from "../../utils/Error";

const Dashboards = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 6577,
    totalSales: 1576,
    totalBuys: 6557,
    totalFees: 45345,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/admin/getallstats",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        const errorMsg = data.error || data.message || "Failed to register user";
        if (errorMsg === "Invalid or expired token") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("isLoggedIn");
          navigate("/signin");
        }
        ErrorToast(errorMsg);
      }

      const stats = await response.json();

      // Optional: You can set this to state if using inside a component
      setStats({
        users: stats.users || 0,
        totalSales: stats.totalSales || 0,
        totalBuys: stats.totalBuys || 0,
        totalFees: stats.totalFees || 0,
      });

      return stats;
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      return null;
    } finally {
      setLoadingStats(false);
    }
  }

  return (
    <div className="flex-1 p-2 space-y-5 ">
      <DashboardMetrics {...stats} />
      {/* <UsersCard users={users} Icon={User2} /> */}
      {/* Dynamic Content Rendering */}
      <Outlet /> {/* This is where the child routes' components will be rendered */}
    </div>
  );
};

export default Dashboards;
