import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  TrendingUp,
  DollarSign,
  User,
  HelpCircle,
  LogOut as LogOutIcon,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "../../utils/AuthProvider";
import { SuccessToast } from "../../utils/Success";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useTranslation } from "react-i18next"; // Import useTranslation

const sidebarData = [
  {
    id: "main",
    links: [
      {
        id: "account-info",
        label: "accountInfo", // Translation key
        to: "profile",
        icon: <User />,
      },
    ],
  },
  {
    id: "sell",
    title: "sell", // Translation key
    links: [
      {
        id: "sell-order",
        label: "sellOrder", // Translation key
        to: "sell-order",
        icon: <TrendingUp />,
      },
      {
        id: "sell-history",
        label: "sellHistory", // Translation key
        to: "sell-history",
        icon: <DollarSign />,
      },
    ],
  },
  {
    id: "buy",
    title: "buy", // Translation key
    links: [
      {
        id: "buy-order",
        label: "buyOrder", // Translation key
        to: "buy-order",
        icon: <TrendingUp />,
      },
      {
        id: "buy-history",
        label: "buyHistory", // Translation key
        to: "buy-history",
        icon: <DollarSign />,
      },
    ],
  },
];

const inquiryData = {
  title: "inquiry", // Translation key
  links: [
    { id: "edit-info", label: "editInfo", to: "edit-info", icon: <User /> },
    {
      id: "one-on-one",
      label: "oneOnOne", // Translation key
      to: "one-on-one",
      icon: <HelpCircle />,
    },
    {
      id: "inquiry-history",
      label: "inquiryHistory", // Translation key
      to: "inquiry-history",
      icon: <HelpCircle />,
    },
  ],
};

function Sidebar() {
  const { t } = useTranslation(); // Initialize translation hook
  const [collapsed, setCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const currentPathSegment =
    location.pathname.split("/").filter(Boolean).pop() || "";

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      localStorage.removeItem("token");
      const response = await logout();
      if (response) {
        SuccessToast("You have just logged out successfully");
        setIsLoading(false);
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
                {user?.fullName}
              </span>
            </div>
          </div>
        )}
        <button
          className="cursor-pointer lg:hidden"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <FiArrowRight size={25} /> : <FiArrowLeft size={25} />}
        </button>
      </div>

      <div className="scroll-auto">
        {/* Scrollable Links Section */}
        <div className="flex-1 px-4">
          {sidebarData.map((section) => (
            <div key={section.id} className="mb-6">
              {section.title && !collapsed && (
                <h3 className="text-gray-400 text-sm font-semibold uppercase mb-2">
                  {t(section.title)} {/* Translate section title */}
                </h3>
              )}
              <ul className="space-y-1">
                {section.links.map((link) => {
                  const active = isActive(link.to);

                  return (
                    <li key={link.id}>
                      <Link
                        to={link.to}
                        className={`flex ${
                          collapsed
                            ? "flex-col items-center gap-1 py-2 px-3"
                            : "items-center gap-3 py-2 px-3"
                        } rounded-md transition-colors hover:bg-gray-700 ${
                          !collapsed && (active ? "bg-[#26a17b]" : "")
                        }`}
                      >
                        {/* Icon container: apply background ONLY when collapsed */}
                        <div
                          className={`rounded-md p-1 ${
                            collapsed
                              ? active
                                ? "bg-[#26a17b] text-white"
                                : "hover:bg-gray-700"
                              : ""
                          }`}
                        >
                          {link.icon}
                        </div>

                        {/* Label inline when expanded */}
                        {!collapsed && <span>{t(link.label)}</span>} {/* Translate label */}

                        {/* Label below icon on small screen when collapsed */}
                        {collapsed && (
                          <span className="block text-xs mt-0.5 text-center sm:hidden">
                            {t(link.label)} {/* Translate label */}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Inquiry Section */}
          <div className="mb-6 mt-20">
            {!collapsed && (
              <h3 className="text-gray-400 text-sm font-semibold uppercase mb-2">
                {t(inquiryData.title)} {/* Translate Inquiry Section Title */}
              </h3>
            )}
            <ul className="space-y-1">
              {inquiryData.links.map((link) => {
                const active = isActive(link.to);

                return (
                  <li key={link.id}>
                    <Link
                      to={link.to}
                      className={`flex ${
                        collapsed
                          ? "flex-col items-center gap-1 py-2 px-3"
                          : "items-center gap-3 py-2 px-3"
                      } rounded-md transition-colors hover:bg-gray-700 ${
                        !collapsed && (active ? "bg-[#26a17b]" : "")
                      }`}
                    >
                      <div
                        className={`rounded-md p-1 ${
                          collapsed
                            ? active
                              ? "bg-[#26a17b] text-white"
                              : "hover:bg-gray-700"
                            : ""
                        }`}
                      >
                        {link.icon}
                      </div>

                      {!collapsed && <span>{t(link.label)}</span>} {/* Translate Inquiry Links */}

                      {collapsed && (
                        <span className="block text-xs mt-0.5 text-center sm:hidden">
                          {t(link.label)} {/* Translate Inquiry Links */}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="flex items-center cursor-pointer gap-3 py-2 px-3 rounded-md hover:bg-red-600 w-full"
          >
            <LogOutIcon size={18} />
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                {t('signOut')} {/* Translate Sign Out */}
              </>
            ) : (
              <>{!collapsed && <span>{t('signOut')}</span>}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
