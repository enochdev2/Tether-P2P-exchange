import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Box,
  Heart,
  Download,
  User,
  HelpCircle,
  LogOut as LogOutIcon,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../utils/AuthProvider";
import { SuccessToast } from "../../utils/Success";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

const sidebarData = [
  {
    id: "main",
    links: [
      {
        id: "account-info",
        label: "Account info",
        to: "profile",
        icon: <User />,
      },
    ],
  },
  {
    id: "sell",
    title: "Sell",
    links: [
      {
        id: "sell-order",
        label: "Sell Order",
        to: "sell-order",
        icon: <TrendingUp />,
      },
      {
        id: "sell-history",
        label: "Sell History",
        to: "sell-history",
        icon: <Download />,
      },
    ],
  },
  {
    id: "buy",
    title: "Buy",
    links: [
      { id: "buy-order", label: "Buy Order", to: "buy-order", icon: <Box /> },
      {
        id: "buy-history",
        label: "Buy History",
        to: "buy-history",
        icon: <Heart />,
      },
    ],
  },
];

const inquiryData = {
  title: "Inquiry",
  links: [
    { id: "edit-info", label: "Edit My Info", to: "edit-info", icon: <User /> },
    {
      id: "one-on-one",
      label: "1:1 inquiry",
      to: "one-on-one",
      icon: <HelpCircle />,
    },
    {
      id: "inquiry-history",
      label: "Inquiry History",
      to: "inquiry-history",
      icon: <HelpCircle />,
    },
  ],
};

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const currentPathSegment =
    location.pathname.split("/").filter(Boolean).pop() || "";

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response) {
        SuccessToast("You have just logged out successfully");
        navigate("/");
      }
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const isActive = (to) => currentPathSegment === to.replace("/", "");

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={` z-10 pt-4  bg-[#1f2937] text-white transition-all duration-300 ${
        collapsed ? "w-[75px]" : "lg:relative fixed w-[300px]"
      }`}
    >
      {/* Top section */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="flex items-center md:ml-14 space-x-4">
            <div className="w-10 h-10 rounded-full bg-[#26a flex items-center pl- justify-center text-white font-bold text-lg space-x-3 md:space-x-6">
              <img
                src="https://i.pravatar.cc/150?img=43"
                className="rounded-full w-12 h-10 hidden sm:block"
                alt=""
              />
              <span className="text-white uppercase text-sm md:text-base font-semibold">
              {user?.fullName
                }
            </span> 
            </div>
          </div>
        )}
        <button
          className="cursor-pointer lg:hidden"
          onClick={() => setCollapsed(!collapsed)}
        >
          {/* {collapsed ? <Menu size={24} /> : <X size={24} />} */}

          {collapsed ? <FiArrowRight size={25} /> : <FiArrowLeft size={25} />}
        </button>
      </div>

      <div className="scroll-auto">
        {/* Scrollable Links Section */}
        <div className="flex-1  px-4">
          {sidebarData.map((section) => (
            <div key={section.id} className="mb-6">
              {section.title && !collapsed && (
                <h3 className="text-gray-400 text-sm font-semibold uppercase mb-2">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-1">
                {section.links.map((link) => (
                  <li key={link.id}>
                    <Link
                      to={link.to}
                      className={`flex items-center gap-3 py-2 px-3 rounded-md transition-colors ${
                        isActive(link.to) ? "bg-[#26a17b]" : "hover:bg-gray-700"
                      }`}
                    >
                      {link.icon}
                      {!collapsed && <span>{link.label}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Inquiry Section */}
          <div className="mb-6 mt-20">
            {!collapsed && (
              <h3 className="text-gray-400 text-sm font-semibold uppercase mb-2">
                {inquiryData.title}
              </h3>
            )}
            <ul className="space-y-1">
              {inquiryData.links.map((link) => (
                <li key={link.id}>
                  <Link
                    to={link.to}
                    className={`flex items-center gap-3 py-2 px-3 rounded-md transition-colors ${
                      isActive(link.to) ? "bg-[#26a17b]" : "hover:bg-gray-700"
                    }`}
                  >
                    {link.icon}
                    {!collapsed && <span>{link.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center cursor-pointer gap-3 py-2 px-3 rounded-md hover:bg-red-600 w-full"
          >
            <LogOutIcon size={18} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
