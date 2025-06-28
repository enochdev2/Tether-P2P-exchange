import React, { useState, useEffect } from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import i18next for translation



const Footers = () => {
  const { t, i18n } = useTranslation(); // Use the i18next translation hook
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();


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
    path: isLoggedIn ? "/dashboard/one-on-one" : "https://t.me/+VGrfRMTwfHUxMTBl",
  },
];

const handleLinkClick = (path) =>{
  if(path.startsWith("http")){
    window.open(path, "_blank");
  } else {
    navigate(path)
  }
}



  useEffect(() => {
    const user = localStorage.getItem("token");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);


  return (
    <footer className="bg-gray-900 text-white py-14 px-6 sm:px-12">
      <div className="max-w-screen-xl mx-auto">
        {/* Footer Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:w-[60%] lg:grid-cols-4 gap-10">
          {footerData.map((section, index) => (
            <div key={index}>
              <h3
                className="text-xl border-r-2 font-semibold mb-5 cursor-pointer"
                onClick={() => handleLinkClick(section.path)}
              >
                {t(section.title)} {/* Translate the title */}
              </h3>
            </div>
          ))}
        </div>

        {/* Footer Bottom */}
        <div className="mt-4 border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-center sm:text-left text-sm max-w-lg">
            {t('footerDescription')} {/* Translated description */}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footers;
