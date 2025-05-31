import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom"; 
import DashboardMetrics from "../../components/DashboardMetrics";
import { useAuth } from "../../utils/AuthProvider";
import Sidebar from "./Sidebar";

const Dashboards = () => {
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
        navigate("/"); // redirect to homepage or unauthorized page
      }
    } else {
      // Not logged in
      navigate("/login"); // redirect to login or homepage
    }
  }, [navigate]);

  useEffect(() => {
    // Replace with real-time fetch or WebSocket subscription
    fetch("/api/admin/metrics")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  return (
    <div className="flex-1 p-2 space-y-5 ">
      <DashboardMetrics {...stats} />
      {/* <UsersCard users={users} Icon={User2} /> */}
      {/* Dynamic Content Rendering */}
      <Outlet />{" "}
      {/* This is where the child routes' components will be rendered */}
    </div>
  );
};

export default Dashboards;
