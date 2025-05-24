import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Box,
  Heart,
  Download,
  User,
  HelpCircle,
  LogOut,
} from "lucide-react"; // Import necessary icons

// Define an array of sidebar links with icons
const sidebarLinks = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: <User className="w-5 h-5" />,
  },
  {
    to: "/admin/transactions",
    label: "Transactions",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    to: "/admin/transaction/1",
    label: "Transactions",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  { to: "/admin/user", label: "User", icon: <Box className="w-5 h-5" /> },
  {
    to: "/admin/alerts",
    label: "System Alerts",
    icon: <Heart className="w-5 h-5" />,
  },
];

function Sidebar() {
  const [activeLink, setActiveLink] = useState("/admin/dashboard"); // Track the active link

  const handleLinkClick = (link) => {
    setActiveLink(link); // Update active link when clicked
  };

  return (
    <div className="flex flex-col w-1/4 bg-gray-900 text-white p-6 h-auto">
      {/* Profile Section */}
      <div className="flex items-center space-x-4 mb-6">
        {/* Profile Image */}
        <div className="w-12 h-12 rounded-full bg-[#26a17b] flex items-center justify-center">
          {/* You can replace the div with an <img> tag for a real profile picture */}
          <span className="text-xl font-bold text-white">Ad</span>{" "}
          {/* Placeholder for user icon */}
        </div>
        <span className="text-white text-lg font-semibold">Admin Panel</span>
      </div>

      {/* Top Links Section */}
      <ul className="space-y-4 flex-1">
        {/* Iterate over the sidebarLinks array */}
        {sidebarLinks.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className={`flex items-center space-x-3 py-2 px-4 cursor-pointer rounded-md ${
                activeLink === link.to ? "bg-[#26a17b]" : "hover:bg-gray-800"
              }`}
              onClick={() => handleLinkClick(link.to)}
            >
              {link.icon}
              <span className="text-lg">{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
