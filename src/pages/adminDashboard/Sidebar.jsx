import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HelpCircle, LogOut as LogOutIcon, TrendingUp, User } from "lucide-react";
import { useAuth } from "../../utils/AuthProvider";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { BiChat } from "react-icons/bi";
import { FaUserCog } from "react-icons/fa";

const sidebarSections = [
  {
    title: "General",
    items: [
      { label: "Dashboard", to: "/admin/dashboard", icon: <User /> },
      { label: "Transactions", to: "/admin/transactions", icon: <HiOutlineSwitchHorizontal /> },
    ],
  },
  {
    title: "Live",
    items: [
      {
        label: "Sell Orders (Live)",
        to: "/admin/sell-orders",
        icon: <TrendingUp />,
      },
      {
        label: "Buy Orders (Live)",
        to: "/admin/buy-orders",
        icon: <TrendingUp />,
      },
      {
        label: "Sell/Buy 1:1 Chat (Live)",
        to: "/admin/chat",
        icon: <BiChat />,
      },
    ],
  },
  {
    title: "User",
    items: [{ label: "User Management", to: "/admin/users", icon: <FaUserCog /> }],
  },
  {
    title: "Inquiry",
    items: [{ label: "1:1 Inquiry Box (Live)", to: "/admin/inquiries", icon: <HelpCircle />, }],
  },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const Section = ({ title, children }) => (
    <div className="mt-6 px-4">
      <h3 className={` uppercase ${collapsed && title ? 'text-[10px] font-[500] text-shadow-white' : 'text-gray-400 text-xs font-semibold'}`}>{title}</h3>
      <div className="h-px bg-blue-500 w-10 my-2"></div>
      <ul className="space-y-1">{children}</ul>
    </div>
  );

  const Item = ({ to, children }) => (
    <li>
      <Link
        to={to}
        className={`flex items-center gap-3 py-2 px-3 rounded-md transition-colors ${
          isActive(to)
            ? "bg-[#26a17b] text-white"
            : "hover:bg-gray-700 text-gray-300"
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
      }`}
    >
      {/* header */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-[#26a17b flex items-center pl- justify-center text-white font-bold text-lg space-x-3 md:space-x-6">
              
              <h3 className="hidden sm:block p-3 rounded-full bg-[#26a17b] font-bold">
                AD
              </h3>
              <span className="ml-3 font-medium text-base">Admin Panel</span>
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

      <div>
        {sidebarSections.map((section) => (
          <Section key={section.title} title={section.title}>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <Item key={item.to} to={item.to}>
                  {item.icon}
                  {!collapsed && <span>{item.label}</span>}
                </Item>
              ))}
            </ul>
          </Section>
        ))}
      </div>

      {/* spacer + logout */}
      <div className="mt-auto px-4 pb-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 rounded hover:bg-red-600 transition"
        >
          <LogOutIcon size={16} />
         {!collapsed &&  <span className="text-white">Log out</span>}
        </button>
      </div>
    </aside>
  );
}

// const Item = ({ to, children }) => (
//   <li>
//     <Link
//       to={to}
//       className={({ isActive }) =>
//         `block text-white px-4 py-2 rounded transition ${
//           isActive ? "bg-[#26a17b]" : "hover:bg-gray-700"
//         }`
//       }
//     >
//       {children}
//     </Link>
//   </li>
// );
