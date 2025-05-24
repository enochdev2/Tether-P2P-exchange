import React, { use, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom"; // Import Outlet for dynamic content rendering
import Sidebar from "./Sidebar";
import { useAuth } from "../../utils/AuthProvider";
import InfoCard from "../../components/InfoCard";
import { SettingsIcon, User2 } from "lucide-react";
import UsersCard from "../../components/UsersCard";

const AdminDashboard = () => {
  const { user, setIsLoggedIn, setUser } = useAuth();
  const navigate = useNavigate();

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
      navigate("/signin"); // redirect to login or homepage
    }
  }, [navigate]);

  const users = [
  { id: 1, name: "User 1", status: "Active" },
  { id: 2, name: "User 2", status: "Inactive" },
];

  return (
    <div className="flex min-h-screen bg-gray-100 pt-18">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 p-8 space-y-5">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
         <UsersCard users={users} Icon={User2}/>
        
        {/* Dynamic Content Rendering */}
        <Outlet />{" "}
        {/* This is where the child routes' components will be rendered */}
      </div>
    </div>
  );
};

export default AdminDashboard;
