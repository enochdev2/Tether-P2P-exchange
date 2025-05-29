import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut as LogOutIcon } from "lucide-react";
import { useAuth } from "../../utils/AuthProvider";


export default function AdminSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const Section = ({ title, children }) => (
    <div className="mt-6 px-4">
      <h3 className="text-gray-400 text-xs font-semibold uppercase">{title}</h3>
      <div className="h-px bg-blue-500 w-10 my-2"></div>
      <ul className="space-y-1">{children}</ul>
    </div>
  );

  const Item = ({ to, children }) => (
    <li>
      <Link
        to={to}
        className="block text-white px-4 py-2 rounded hover:bg-gray-700 transition"
      >
        {children}
      </Link>
    </li>
  );

  return (
    <aside className="bg-[#1f2937] text-white w-[280px] min-h-screen flex flex-col">
      {/* header */}
      <div className="flex items-center px-4 py-5">
        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center font-bold">
          Ad
        </div>
        <span className="ml-3 font-medium text-base">Admin Panel</span>
      </div>

      {/* top links */}
      <ul className="space-y-1">
        <Item to="/admin/dashboard">Dashboard</Item>
        <Item to="/admin/transactions">Transactions</Item>
      </ul>

      {/* LIVE section */}
      <Section title="Live">
        <Item to="/admin/sell-orders">Sell Orders (Live)</Item>
        <Item to="/admin/buy-orders">Buy Orders (Live)</Item>
        <Item to="/admin/chat">Sell/Buy 1:1 Chat (Live)</Item>
      </Section>

      {/* User section */}
      <Section title="User">
        <Item to="/admin/users">User Management</Item>
      </Section>

      {/* Inquiry section */}
      <Section title="Inquiry">
        <Item to="/admin/inquiries">1:1 Inquiry Box (Live)</Item>
      </Section>

      {/* spacer + logout */}
      <div className="mt-auto px-4 pb-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 rounded hover:bg-red-600 transition"
        >
          <LogOutIcon size={16} />
          <span className="text-white">Log out</span>
        </button>
      </div>
    </aside>
  );
}




const Item = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className={({ isActive }) =>
        `block text-white px-4 py-2 rounded transition ${
          isActive ? "bg-[#26a17b]" : "hover:bg-gray-700"
        }`
      }
    >
      {children}
    </Link>
  </li>
);