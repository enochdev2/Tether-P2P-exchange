import React, { useState } from "react";
import { Link } from "react-router-dom";

const sidebarSections = [
  {
    title: null,
    links: [
      {
        id: "account-info",
        label: "Account info",
        to: "/account-info",
      },
    ],
  },
  {
    title: "Sell",
    links: [
      { id: "sell-order", label: "Sell Order", to: "/sell-order" },
      { id: "sell-history", label: "Sell History", to: "/sell-history" },
    ],
  },
  {
    title: "Buy",
    links: [
      { id: "buy-order", label: "Buy Order", to: "/buy-order" },
      { id: "buy-history", label: "Buy History", to: "/buy-history" },
    ],
  },
];

function Sidebar() {
  const [activeLink, setActiveLink] = useState("account-info");

  const handleLinkClick = (id) => {
    setActiveLink(id);
  };

  return (
    <div className="flex flex-col w-64 bg-gray-900 text-white p-6 min-h-screen">
      {/* Profile Section */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-10 h-10 rounded-full bg-[#26a17b] flex items-center justify-center text-white font-bold text-lg">
          U
        </div>
        <span className="text-white text-lg font-semibold lowercase">admin</span>
      </div>

      {/* Sidebar Links */}
      <div className="flex flex-col space-y-6 text-lg font-normal">
        {sidebarSections.map((section, idx) => (
          <div key={idx}>
            {section.title && (
              <h3 className="mb-2 text-gray-400 uppercase tracking-wide font-semibold text-sm">
                {section.title}
              </h3>
            )}
            <ul className="flex flex-col space-y-1">
              {section.links.map((link) => (
                <li key={link.id}>
                  <button
                    className={`w-full text-left py-2 px-4 rounded-md text-white ${
                      activeLink === link.id
                        ? "bg-[#26a17b]"
                        : "hover:bg-gray-800"
                    }`}
                    onClick={() => handleLinkClick(link.id)}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
