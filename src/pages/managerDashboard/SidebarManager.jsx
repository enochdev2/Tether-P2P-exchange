import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HelpCircle, LogOut as LogOutIcon, TrendingUp, User } from "lucide-react";
import { useAuth } from "../../utils/AuthProvider";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { BiChat } from "react-icons/bi";
import { FaSortAmountUpAlt, FaUserCog } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const sidebarSections = [
  {
    // title: t("adminPanel.sections.general"),
    items: [
      { key: "managerDashboard", to: "/manager/dashboard", icon: <User /> },
    ],
  },
  {
    // title: t("adminPanel.sections.live"),
    items: [
      { key: "userlist", to: "/manager/user-list", icon: <FaUserCog /> },
    ],
  },
];
const sidebarSections2 = [
  {
    // title: t("adminPanel.sections.user"),
    items: [{ key: "fee", to: "/manager/fee", icon: <FaUserCog /> }],
  },
];

export default function ManagerSidebar() {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    const res = await logout();
    if (res) {
      navigate("/");
    }
  };

  const Section = ({ title, children }) => (
    <div className="mt-6 px-4">
      <div className="flex gap-2 items-center mb-2">
        <h3
          className={` uppercase ${
            collapsed && title
              ? "text-[10px] font-[500] text-shadow-white"
              : "text-gray-400 text-xs font-semibold"
          }`}
        >
          {title}
        </h3>
        <div className={`h-px bg-blue-500 w-[60%] my-2 ${collapsed ? "hidden" : "block"}`}></div>
      </div>
      <ul className="space-y-1">{children}</ul>
    </div>
  );

  const Item = ({ to, children }) => (
    <li>
      <Link
        to={to}
        className={`flex items-center gap-3 py-2 px-3 rounded-md transition-colors ${
          isActive(to) ? "bg-[#26a17b] text-white" : "hover:bg-gray-700 text-gray-300"
        }`}
      >
        {children}
      </Link>
    </li>
  );

  return (
    <aside
      className={` z-10 pt-4  bg-[#1f2937] text-white transition-all duration-300 ${
        collapsed ? "w-[75px]" : "lg:relative fixed w-[300px]"
      } h-full`}
    >
      {/* header */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-[#26a17b flex items-center justify-center text-white font-bold text-lg space-x-3 md:space-x-2">
              <h3 className="hidden sm:block p-3 rounded-full bg-[#26a17b] font-bold">MA</h3>
              <span className="ml-3 font-medium text-base"> {t("managerItems.managerItems")}</span>
            </div>
          </div>
        )}

        <button className="cursor-pointer lg:hidden" onClick={() => setCollapsed(!collapsed)}>

          {collapsed ? <FiArrowRight size={25} /> : <FiArrowLeft size={25} />}
        </button>
      </div>

      <div className="">
        {sidebarSections.map((section) => (
          <Section key={section.title} title={section.title}>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <Item key={item.to} to={item.to}>
                  {item.icon}
                  {!collapsed && <span>{t(`managerItems.${item.key}`)}</span>}
                </Item>
              ))}
            </ul>
          </Section>
        ))}
      </div>
      <div className="mt-2">
        {sidebarSections2.map((section) => (
          <Section key={section.title} title={section.title}>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <Item key={item.to} to={item.to}>
                  {item.icon}
                  {!collapsed && <span>{t(`managerItems.${item.key}`)}</span>}
                </Item>
              ))}
            </ul>
          </Section>
        ))}
      </div>

      {/* spacer + logout */}
      <div className=" px-4 mt-8 pb-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center cursor-pointer gap-2 px-4 py-2 rounded hover:bg-red-600 transition"
        >
          <LogOutIcon size={16} />
          {!collapsed && <span className="text-white">{t("adminPanel.items.logout")}</span>}
        </button>
      </div>
    </aside>
  );
}
    