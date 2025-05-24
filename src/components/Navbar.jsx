import React, { useEffect, useState } from "react";
import {
  ArrowUpDown,
  Eye,
  FileText,
  Settings,
  Share2,
  User,
  Users,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";
import logo2 from "../assets/Tether2.png";
import logo from "../assets/Tether.png";

const Navbar = () => {
  const { isLoggedIn, user } = useAuth();
  const [activeLink, setActiveLink] = useState(""); // Track the active link
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Manage mobile menu visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Manage dropdown visibility
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  // const [isLoggedIn, setIsLoggedIn] = useState(false); // Check if the user is logged in

  const navLinks = [
    { name: "Home", to: "/", private: false },
    // { name: "Trade Listings", to: "/trade-listings", private: false },
    { name: "Transaction History", to: "/post-offer", private: false },
    { name: "My Page", to: "/dashboard/profile", private: true },
  ];

  const handleLinkClick = (link) => {
    setActiveLink(link);
    if (isMenuOpen) setIsMenuOpen(false); // Close menu on link click
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen); // Toggle the mobile menu
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen); // Toggle the profile dropdown
  const togglePasswordVisibility = () => setShowPassword(!showPassword); // Toggle password visibility

  useEffect(() => {
    // Check if the user is an admin and handle accordingly
  }, [user]);

  return (
    <nav className="bg-black  fixed  text-white  w-full transition-all duration-300 ease-linear z-50 shadow-lg py-2 px-4 border-b border-b-gray-500 overflow-x-hidden overflow-y-hidden">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/">
            <div className="flex flex-shrink-0 justify-center items-center text-white space-x-2 text-xl font-bold">
              <img src={logo} className="w-12 h-12" />
              <span className="lg:block hidden"> Tether Zone</span>
            </div>
          </Link>

          {/* Desktop Navbar */}
          <div className="hidden md:flex space-x-6 py-2">
            {navLinks
              .filter((link) => !link.private || isLoggedIn) // Show links based on login status
              .map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  className={`${
                    activeLink === link.name ? "text-white" : "text-gray-300"
                  } hover:text-white px-2 py-2 rounded-md text-[15px] font-medium`}
                  onClick={() => handleLinkClick(link.name)}
                >
                  {link.name}
                </Link>
              ))}
          </div>

          {/* Right Side - User Info and Profile Dropdown */}
          <div className="flex items-center space-x-3">
            {/* USDT Price Section */}
            <div className="flex items-center space-x-2 bg-tea-500 rounded-full px-3 py-1 text-white">
              <span>
                <img src={logo2} alt="" className="w-8 h-8" />
              </span>
              <span className="text-sm">USDT/₩1,435.5</span>
            </div>

            {isLoggedIn ? (
              <>
                {/* Email and password visibility toggle */}
                <div className="text-gray-300 hidden md:flex flex-col items-end">
                  <span className="text-xs md:text-sm">{user?.username}</span>
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {/* <Eye
                      className="w-4 h-4 inline-block"
                      color={showPassword ? "green" : "white"}
                    /> */}
                  </span>
                </div>

                {/* Profile Icon and Dropdown */}
                <div className="relative z-50 hidden md:flex ">
                  <button
                    onClick={toggleDropdown}
                    className="text-white flex items-center space-x-2"
                  >
                    <User className="w-7 h-7 rounded-full bg-gray-600 p-1" />{" "}
                    {/* Profile Icon */}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 w-60 bg-white text-black shadow-lg rounded-md mt-2 z-100">
                      <div className="px-4 py-2 border-b">
                        <span className="text-sm text-red-500">Verify Me</span>
                      </div>
                      <ul className="py-2 text-sm space-y-2">
                        <li className="flex items-center space-x-2 hover:bg-gray-100 px-4 py-2 rounded-md">
                          <User className="w-4 h-4" />
                          <Link to="/profile">My Profile</Link>
                        </li>
                        <li className="flex items-center space-x-2 hover:bg-gray-100 px-4 py-2 rounded-md">
                          <Settings className="w-4 h-4" />
                          <Link to="/payment-methods">Payment Methods</Link>
                        </li>
                        <li className="flex items-center space-x-2 hover:bg-gray-100 px-4 py-2 rounded-md">
                          <FileText className="w-4 h-4" />
                          <Link to="/settings">Settings</Link>
                        </li>
                        <li className="flex items-center space-x-2 hover:bg-gray-100 px-4 py-2 rounded-md">
                          <FileText className="w-4 h-4" />
                          <Link to="/trade-history">Trade History</Link>
                        </li>
                        <li className="flex items-center space-x-2 hover:bg-gray-100 px-4 py-2 rounded-md">
                          <Users className="w-4 h-4" />
                          <Link to="/trade-partners">Trade Partners</Link>
                        </li>
                        <li className="flex items-center space-x-2 hover:bg-gray-100 px-4 py-2 rounded-md">
                          <Share2 className="w-4 h-4" />
                          <Link to="/invite-friend">Invite a Friend</Link>
                        </li>
                        <li className="flex items-center space-x-2 hover:bg-gray-100 px-4 py-2 rounded-md">
                          <ArrowUpDown className="w-4 h-4" />
                          <Link to="/my-transactions">My Transactions</Link>
                        </li>
                        <li className="flex items-center space-x-2 hover:bg-gray-100 px-4 py-2 rounded-md">
                          <X className="w-4 h-4" />
                          <Link to="/logout">Log Out</Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="hidden lg:flex items-center space-x-4">
                  <Link
                    to="/signin"
                    className="bg-gray-800 text-white px-5 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition"
                    onClick={() => handleLinkClick("signin")}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-green-800 text-white px-5 py-2 rounded-md text-base font-medium hover:bg-green-600 transition"
                    onClick={() => handleLinkClick("signup")}
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            )}
          </div>
          {/* Render Admin Dashboard if user is admin */}
          {user && user.admin && (
            <Link
              to="/admin"
              className="text-white bg-green-800  px-3 shadow-green-700 shadow-2xl py-3 rounded-xl text-[15px] font-bold "
              onClick={() => handleLinkClick("admin-dashboard")}
            >
              Admin
            </Link>
          )}

          {/* Mobile Navbar Hamburger */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-white hover:text-yellow-500 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen ? "true" : "false"}
              onClick={toggleMenu} // Toggle menu on click
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden " id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks
              .filter((link) => !link.private || isLoggedIn)
              .map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  className={`${
                    activeLink === link.name ? "" : "text-white"
                  } block px-3 py-2 rounded-md text-base font-medium`}
                  onClick={() => handleLinkClick(link.name)}
                >
                  {link.name}
                </Link>
              ))}
            {isLoggedIn ? (
              <Link
                to="/logout"
                className="bg-gray-800 text-white px-4 py-2 rounded-md text-lg font-medium"
                onClick={() => handleLinkClick("logout")}
              >
                Sign Out
              </Link>
            ) : (
              <>
                <div className="flex flex-col  sm:flex-row items-center gap-3 sm:gap-4 mt-4 sm:mt-0">
                  <Link
                    to="/signin"
                    className="w-full sm:w-auto bg-gray-800 text-white px-4 py-2 rounded-md text-base font-medium text-center"
                    onClick={() => handleLinkClick("signin")}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="w-full sm:w-auto bg-green-800 text-white px-4 py-2 rounded-md text-base font-medium text-center"
                    onClick={() => handleLinkClick("signup")}
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
