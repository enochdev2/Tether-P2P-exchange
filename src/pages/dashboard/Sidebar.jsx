import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Box, Heart, Download, User, HelpCircle, LogOut } from 'lucide-react'; // Import necessary icons
import { useAuth } from '../../utils/AuthProvider';
import { SuccessToast } from '../../utils/Success';
// import { User, LogOut } from "lucide-react"; // example icons for Account info and Sign out




const sidebarData = [
  {
    id: "main",
    links: [
      {
        id: "account-info",
        label: "Account info",
        to: "/account-info",
        icon: null, // Add icon here if needed
        active: true, // default active link
      },
    ],
  },
  {
    id: "sell",
    title: "Sell",
    links: [
      { id: "sell-order", label: "Sell Order", to: "/sell-order" },
      { id: "sell-history", label: "Sell History", to: "/sell-history" },
    ],
  },
  {
    id: "buy",
    title: "Buy",
    links: [
      { id: "buy-order", label: "Buy Order", to: "/buy-order" },
      { id: "buy-history", label: "Buy History", to: "/buy-history" },
    ],
  },
];

const inquiryData = {
  title: "Inquiry",
  links: [
    { id: "edit-info", label: "Edit My Info", to: "/edit-info" },
    { id: "one-on-one", label: "1:1 inquiry", to: "/one-on-one" },
    { id: "inquiry-history", label: "Inquiry History", to: "/inquiry-history" },
    { id: "sign-out", label: "Sign out", to: "/sign-out" },
  ],
};

function Sidebar() {
  const [activeLink, setActiveLink] = useState("account-info");

     const { logout, user } = useAuth(); 
   const navigate = useNavigate();

  const logouts = async () => {


    try {
      // Call signUp from AuthContext (which will handle the state and potentially an API call)
      const response = await logout();

      if(response){

        SuccessToast(" you have just Logout successfully");
        navigate('/'); 
      }else {
        return;
      }       
    } catch (error) {
      console.error('Error during sign-up:', error);
      // Optionally handle error here (e.g., show error message)
    }
  };

  const handleLinkClick = (id) => {
    setActiveLink(id);
  };

  return (
    <div className="flex flex-col w-64 bg-[#1f2937] text-white p-6 min-h-auto ">
      {/* Top Section */}
      <div className='mb-32'>
        {/* Profile */}
        <div className="flex items-center space-x-4 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#26a17b] flex items-center justify-center text-white font-bold text-lg">
            U
          </div>
          <span className="text-white text-lg font-semibold lowercase">admin</span>
        </div>

        {/* Sidebar links */}
        {sidebarData.map((section) => (
          <div key={section.id} className="mb-4">
            {section.title && (
              <h3 className="mb-1 flex items-center  text-gray-400 uppercase tracking-wide font-semibold text-sm">
                {section.title} <div className='  w-16 h-0.5 ml-3 bg-sky-700/50'/>
              </h3>
            )}
            <ul className="space-y-">
              {section.links.map((link) => (
                <li key={link.id}>
                  <button
                    className={`w-full text-left py-2 px-4 cursor-pointer rounded-md ${
                      activeLink === link.id
                        ? "bg-[#26a17b]"
                        : "hover:bg-gray-700"
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

      {/* Bottom Inquiry Section */}
      <div>
        <h3 className="mb-2 text-gray-400 uppercase tracking-wide font-semibold text-sm">
          {inquiryData.title}
        </h3>
        <ul className="space-y-1">
          {inquiryData.links.map((link) => (
            <li key={link.id}>
              <button
                className={`w-full text-left py-2 px-4 rounded-md ${
                  activeLink === link.id
                    ? "bg-[#26a17b]"
                    : "hover:bg-gray-700"
                }`}
                onClick={() => handleLinkClick(link.id)}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
