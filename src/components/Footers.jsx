import React, { useState, useEffect } from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const footerData = [
  {
    title: "Trade crypto",
    path: "/",
  },
  {
    title: "Sell Tether",
    path: "/dashboard/sell-history",
  },
  {
    title: "Buy Tether",
    path: "/dashboard/buy-history",
  },
  {
    title: "Support",
    path: "/dashboard/one-on-one",
  },
];

const Footers = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Use this state to track login status
  const navigate = useNavigate(); // For programmatic navigation

  // Simulate checking login status (you can replace this with your authentication logic)
  useEffect(() => {
    // Example logic to set isLoggedIn (you would replace it with actual logic, such as checking a token or session)
    const user = localStorage.getItem("token"); // Check if user info is stored in localStorage or check authentication
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  // Handle navigation on link click
  const handleLinkClick = (path) => {
    if (isLoggedIn) {
      navigate(path); // Redirect to different area if user is logged in
    }
    // If the user is not logged in, do nothing (no redirection happens)
  };

  return (
    <footer className="bg-gray-900 text-white py-14 px-6 sm:px-12">
      <div className="max-w-screen-xl mx-auto">
        {/* Footer Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:w-[60%] lg:grid-cols-4 gap-10">
          {footerData.map((section, index) => (
            <div key={index}>
              <h3
                className="text-xl border-r-2 font-semibold mb-5 cursor-pointer"
                onClick={() => handleLinkClick(section.path)} // Handle the click to redirect if logged in
              >
                {section.title}
              </h3>
            </div>
          ))}
        </div>
        <div></div>

        {/* Footer Bottom */}
        <div className="mt-4 border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-center sm:text-left text-sm max-w-lg">
            Effortlessly exchange with complete transparency, security, and convenience. Your journey to financial freedom starts here.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footers;
