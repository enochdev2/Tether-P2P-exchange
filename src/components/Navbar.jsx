import React, { useEffect, useState } from "react";
import i18n from "i18next";
import { ArrowUpDown, Eye, FileText, Settings, Share2, User, Users, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo2 from "../assets/Tether2.png";
import logo from "../assets/Tether.png";
import { useAuth } from "../utils/AuthProvider";
import { FaGlobe } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

const Navbar = () => {
  const { t } = useTranslation();
  const { isLoggedIn, user, priceKRW } = useAuth();
  const [activeLink, setActiveLink] = useState(""); // Track the active link
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Manage mobile menu visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Manage dropdown visibility
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [language, setLanguage] = useState(i18n.language.toUpperCase() || "EN"); // Initial language state
  const [isOpen, setIsOpen] = useState(false);

  // Check if language is stored in localStorage and set it on component mount
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage.toLowerCase());
      setLanguage(storedLanguage);
    } else {
      i18n.changeLanguage("en");
      setLanguage("EN");
    }
  }, []);

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
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuth();

  const navigate = useNavigate();

  const toggleDropdownLan = () => setIsOpen(!isOpen);

  const selectLanguage = (lang) => {
    console.log("🚀 ~ selectLanguage ~ lang:", lang);
    i18n.changeLanguage(lang.toLowerCase()); // Change language dynamically with i18n
    localStorage.setItem("language", lang);
    setLanguage(lang);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      localStorage.removeItem("token");
      const response = await logout();
      if (response) {
        toast.success("You have just logged out successfully");
        setIsLoading(false);
        navigate("/");
        setIsMenuOpen(false);
      }
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <nav className="bg-black  fixed  text-white  w-full transition-all duration-300 ease-linear z-50 h- shadow-lg py-2 px-4 border-b border-b-gray-500 ">
      <div className="max-w-screen-xl  mx-auto px-4 sm:px-6 lg:px-8">
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
                  {t(link.name)}
                </Link>
              ))}
          </div>

          {/* Right Side - User Info and Profile Dropdown */}
          <div className="flex items-center space-x-3">
            {/* USDT Price Section */}
            <div className="flex items-center space-x-2 bg-tea-500 rounded-full px-3 py-1 text-white">
              <span>
                <img src={logo2} alt="" className="md:w-8 md:h-8 w-6 h-6" />
              </span>
              <span className="text-xs md:text-sm">
                {t("USDT/₩")}
                {priceKRW}
              </span>
            </div>

            {isLoggedIn ? (
              <>
                {/* Display Username (Mobile & Desktop) */}
                {/* <div className="hidden md:flex flex-col items-end text-sm text-gray-200 font-medium mb-1">
                  <span>{user?.username}</span>
                </div> */}

                {/* Profile Icon and Dropdown */}
                <div className="relative z-50 hidden md:flex ">
                  {/* <button
                    // onClick={toggleDropdown}
                    className="flex items-center gap-2 text-white hover:text-gray-300 transition duration-200"
                  > */}

                  {/* <div className="w-10 h-10 rounded-full bg-[#26a17b] flex items-center justify-center text-white font-bold text-lg">
                      <img
                        src="https://i.pravatar.cc/150?img=43"
                        className="rounded-full"
                        alt=""
                      />
                    </div> */}
                  {/* <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg> */}
                  {/* </button> */}

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white shadow-lg rounded-xl overflow-hidden ring-1 ring-black/10 transition-all duration-300 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <span className="text-sm font-semibold text-[#CC1747]">
                          {t("Verify Me")}
                        </span>
                      </div>
                      <ul className="text-sm divide-y divide-gray-100">
                        {[
                          {
                            icon: <User className="w-4 h-4" />,
                            label: "My Profile",
                            to: "/profile",
                          },
                          {
                            icon: <Settings className="w-4 h-4" />,
                            label: "Payment Methods",
                            to: "/payment-methods",
                          },
                          {
                            icon: <FileText className="w-4 h-4" />,
                            label: "Settings",
                            to: "/settings",
                          },
                          {
                            icon: <FileText className="w-4 h-4" />,
                            label: "Trade History",
                            to: "/trade-history",
                          },
                          {
                            icon: <Users className="w-4 h-4" />,
                            label: "Trade Partners",
                            to: "/trade-partners",
                          },
                          {
                            icon: <Share2 className="w-4 h-4" />,
                            label: "Invite a Friend",
                            to: "/invite-friend",
                          },
                          {
                            icon: <ArrowUpDown className="w-4 h-4" />,
                            label: "My Transactions",
                            to: "/my-transactions",
                          },
                          {
                            icon: <X className="w-4 h-4 text-red-500" />,
                            label: "Log Out",
                            to: "/logout",
                            danger: true,
                          },
                        ].map((item, idx) => (
                          <li
                            key={idx}
                            className={`flex items-center gap-2 px-4 py-3 hover:bg-gray-100 transition ${
                              item.danger ? "text-red-600 hover:bg-red-100" : "text-gray-700"
                            }`}
                          >
                            {item.icon}
                            <Link to={item.to} className="block w-full">
                              {item.label}
                            </Link>
                          </li>
                        ))}
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
                    {t("Sign In")}
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-green-800 text-white px-5 py-2 rounded-md text-base font-medium hover:bg-green-600 transition"
                    onClick={() => handleLinkClick("signup")}
                  >
                    {t("Sign Up")}
                  </Link>
                </div>
              </>
            )}
          </div>
          {/* Render Admin Dashboard if user is admin */}
          {user && user.admin && (
            <div className="flex items-center gap-5 justify-between">
              <Link
                to="/admin/dashboard"
                className="text-white bg-green-800 hidden lg:block px-3 shadow-green-700 shadow-2xl  py-2 md:py-3 rounded-xl text-[12px] md:text-[15px] font-bold "
                onClick={() => handleLinkClick("admin-dashboard")}
              >
                {t("Admin")}
              </Link>
            </div>
          )}
          <div className="relative inline-block z-100 text-left">
            <button
              onClick={toggleDropdownLan}
              className="flex items-center bg-gradient-to-br from-[#26a17b] via-[#3b82f6] to-[#f59b0b] gap-0.5 px-2 md:px-4 md:py-2 py-1 text-white rounded-md focus:outline-none hover:from-[#3b82f6] hover:via-[#f59b0b] hover:to-[#26a17b] text-xs md:text-base cursor-pointer"
            >
              <FaGlobe className="text-lg text-sky-900 mr-0" />
              <span className="ml-0">{!language ? "ENG" : ""}</span>
              <span>{language}</span>
            </button>

            {isOpen && (
              <div className="absolute -right-5 bg-[#84c9e2] text-white mt-2 w-28 bg rounded-md shadow-lg z-5000 cursor-pointer">
                <button
                  onClick={() => selectLanguage("EN")}
                  className={`flex items-center block w-full text-left px-2 md:px-4 py-2 text-xs md:text-sm hover:bg-gray-100 cursor-pointer ${
                    language === "ENG" ? "font-semibold text-gray-900" : "text-gray-600"
                  }`}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg"
                    alt="US Flag"
                    className="w-5 h-3 mr-2"
                  />
                  ENG
                </button>
                <button
                  onClick={() => selectLanguage("KO")}
                  className={`flex items-center block w-full text-left px-2 md:px-4 py-2 text-xs md:text-sm hover:bg-gray-100 cursor-pointer ${
                    language === "KOR" ? "font-semibold text-gray-900" : "text-gray-600"
                  }`}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_South_Korea.svg"
                    alt="Korea Flag"
                    className="w-5 h-3 mr-2"
                  />
                  KOR
                </button>
              </div>
            )}
          </div>

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
                  {t(link.name)}
                </Link>
              ))}
            {isLoggedIn ? (
              <Link
                onClick={handleLogout}
                disabled={isLoading}
                className="logout-button inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white px-5 py-2.5 rounded-full text-base font-semibold shadow-md hover:shadow-lg transition duration-300 ease-in-out"
                // onClick={() => handleLinkClick("logout")}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10v1"
                  />
                </svg>
                {isLoading ? 'Sign Out...' : 'Sign Out'}
              </Link>
            ) : (
              <>
                <div className="flex flex-col  sm:flex-row items-center gap-3 sm:gap-4 mt-4 sm:mt-0">
                  <Link
                    to="/signin"
                    className="w-full sm:w-auto bg-gray-800 text-white px-4 py-2 rounded-md text-base font-medium text-center"
                    onClick={() => handleLinkClick("signin")}
                  >
                    {t("Sign In")}
                  </Link>
                  <Link
                    to="/signup"
                    className="w-full sm:w-auto bg-green-800 text-white px-4 py-2 rounded-md text-base font-medium text-center"
                    onClick={() => handleLinkClick("signup")}
                  >
                    {t("Sign Up")}
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
