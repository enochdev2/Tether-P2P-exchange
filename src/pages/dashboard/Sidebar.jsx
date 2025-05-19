import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Box, Heart, Download, User, HelpCircle, LogOut } from 'lucide-react'; // Import necessary icons
import { useAuth } from '../../utils/AuthProvider';
import { SuccessToast } from '../../utils/Success';

// Define an array of sidebar links with icons
const sidebarLinks = [
  { to: 'profile', label: 'Profile Overview', icon: <User className="w-5 h-5" /> },
  { to: 'my-trade', label: 'My Trade', icon: <TrendingUp className="w-5 h-5" /> },
  { to: 'transactions', label: 'Trade History', icon: <TrendingUp className="w-5 h-5" /> },
  { to: 'offers', label: 'My Offers', icon: <Box className="w-5 h-5" /> },
  { to: 'favorite-offers', label: 'Favorite Offers', icon: <Heart className="w-5 h-5" /> },
  { to: 'trade-statistics', label: 'Trade Statistics', icon: <Download className="w-5 h-5" /> },
];

const sidebarLinksBottom = [
  { to: 'settings', label: 'Account Settings', icon: <User className="w-5 h-5" /> },
  { to: 'support', label: 'Support', icon: <HelpCircle className="w-5 h-5" /> },
  // { to: 'logout', label: 'Logout', icon: <LogOut className="w-5 h-5" /> },
];

 

function Sidebar() {
  const { logout, user } = useAuth(); 
   const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState('profile'); // Track the active link

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


  const handleLinkClick = (link) => {
    setActiveLink(link); // Update active link when clicked
  };

  return (
    <div className="flex flex-col w-1/4 bg-gray-800 text-white p-6 h-">
      {/* Profile Section */}
      <div className="flex items-center space-x-4 mb-6">
        {/* Profile Image */}
        <div className="w-12 h-12 rounded-full bg-[#26a17b] flex items-center justify-center">
          {/* You can replace the div with an <img> tag for a real profile picture */}
          <span className="text-xl font-bold text-white">U</span> {/* Placeholder for user icon */}
        </div>
        <span className="text-white text-2xl font-semibold">{user?.username}</span>
      </div>

      {/* Top Links Section */}
      <ul className="space-y-4 mb-28">
        {/* Iterate over the sidebarLinks array */}
        {sidebarLinks.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className={`flex items-center space-x-3 py-2 px-4 rounded-md ${activeLink === link.to ? 'bg-[#26a17b]' : 'hover:bg-gray-600'}`}
              onClick={() => handleLinkClick(link.to)}
            >
              {link.icon}
              <span className="text-lg">{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Bottom Links Section */}
      <ul className="space-y-4 mt-">
        {/* Iterate over the sidebarLinksBottom array */}
        {sidebarLinksBottom.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className={`flex items-center space-x-3 py-2 px-4 rounded-md ${activeLink === link.to ? 'bg-green-500' : 'hover:bg-gray-600'}`}
              onClick={() => handleLinkClick(link.to)}
            >
              {link.icon}
              <span className="text-lg">{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <button onClick={logouts} className='flex pl-4 cursor-pointer py-3 rounded-2xl hover:bg-[#26a17b]'> <LogOut className="w-5 h-5 mr-3 " /> Logout</button>
    </div>
  );
}

export default Sidebar;
