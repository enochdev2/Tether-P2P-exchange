import { useEffect, useState } from "react";
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";

const Hero = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section
      className="relative lg:mt-20 text-white w-full min-h-screen  flex items-center"
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
        <div className="w-full md:w-2/3 text-center md:text-left lg:space-y-6 space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            The Secure,
          </h1>
          <h1 className="text-3xl sm:text-5xl md:text-[58px] font-bold text-green-600">
            People-powered way to
          </h1>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Exchange your USDT <span className="text-green-600">→</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl font-medium text-gray-300">
            Effortlessly exchange with complete transparency, security, and
            convenience. Your journey to financial freedom starts here.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row sm:justify-center md:justify-start gap-4">
            {!user ? (
              <>
                <Link
                  className="bg-gray-800 text-white px-8 py-2 rounded-md text-base font-medium hover:bg-gray-700 sm:w-auto w-full transition"
                  to="signin"
                >
                  Sign In
                </Link>
                <Link
                  className="bg-green-800 text-white px-8 py-2 rounded-md text-base font-medium hover:bg-green-600 sm:w-auto w-full transition"
                  to="signin"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <Link to="/trade-listings">
                <button className="bg-green-600 hover:bg-green-700 transition text-white py-3 px-6 rounded-xl font-bold text-lg w-full sm:w-auto">
                  Explore Trade Offers
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Right Side Image */}
        <div className="hidden md:block md:w-1/2">
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
