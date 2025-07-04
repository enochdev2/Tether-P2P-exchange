import { useEffect, useState } from "react";
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from 'react-i18next';
// import { useEffect } from 'react';

const Hero = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <section
      className="relative lg:mt-20 text-white w-full min-h-screen flex items-center"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black opacity-90 z-0" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-12 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Side */}
        <div
          className="w-full md:w-2/3 text-center md:text-left lg:space-y-6 space-y-4"
          data-aos="fade-right"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            {t('The Secure')}
          </h1>
          <h1 className="text-3xl sm:text-5xl md:text-[50px] font-bold text-green-600">
            {t('People-powered way to')}
          </h1>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            {t('Exchange your USDT')} <span className="text-green-600">→</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl font-medium text-gray-300">
            {t('text2')}
          </p>

          <div
            className="mt-6 flex flex-col sm:flex-row sm:justify-center md:justify-start gap-4"
            data-aos="fade-up"
          >
            {!user ? (
              <>
                <Link
                  className="bg-gray-800 text-white px-8 py-2 rounded-md text-base font-medium hover:bg-gray-700 sm:w-auto w-full transition"
                  to="signin"
                >
                    {t('Sign In')}
                </Link>
                <Link
                  className="bg-green-800 text-white px-8 py-2 rounded-md text-base font-medium hover:bg-green-600 sm:w-auto w-full transition"
                  to="signup"
                >
                   {t('Sign Up')}
                </Link>
              </>
            ) : (
              <Link to="/post-offer">
                <button className="bg-green-600 hover:bg-green-700 transition text-white py-3 px-6 rounded-xl font-bold text-lg w-full sm:w-auto">
                  {t('Explore Trade Offers')}
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Right Side Image */}
        <div className="hidden md:block md:w-1/2" data-aos="fade-left">
          <img
            src="/bg.png"
            alt="World Map or Exchange Illustration"
            className="w-full h-auto rounded-xl object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
