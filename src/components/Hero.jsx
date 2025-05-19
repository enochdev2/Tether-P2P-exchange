import { useEffect, useState } from "react";
import React from 'react'
import { Link } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";


const Hero = () => {
  const {user} = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [user, setUser] = useState({})

  //  useEffect(() => {
  //   const storedUser = localStorage.getItem("user");

  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //   }
  // }, []);


  return (
    <div className="relative bg-black text-white w-screen min-h-screen pt-44" style={{ backgroundImage: "url('/bg.png')" }} >
      {/* Main Container */}
      <div className="flex items-center justify-between px-6 py- max-w-screen-xl mx-auto">
        {/* Left Side */}
        <div className="space-y-10 md:space-y-5 h-full md:w-[45%]">
          <h1 className=" text-4xl md:text-[48px] my-1 md:my-0 space-y-  font-semibold">
            The Secure,
          </h1>
          <h1 className=" text-[40px] md:text-[56px] my-1 md:my-0 text-green-700  font-semibold">
            people-powered
          </h1>
          <h1 className=" text-4xl md:text-[48px] mt-3 md:mt-0  space-y-  font-semibold">
             Way to Exchange your USDT{" "}
            <span className="text-green-700">→</span>
          </h1>
          <p className="text-lg md:text-xl md:font-semibold w-full">
            Effortlessly exchange with complete transparency, security, and convenience. Your journey to financial freedom starts here.
          </p>

          <div className="mt-4 space-x-3">
            {!user ?
            (
              <>
            <button className="bg-[#26a17b] text-white py-3 px-4 rounded-xl font-semibold">
              <Link to='signin'>
              Sign In now
              </Link>
            </button>
            <button className="bg-[#26a17b] text-white py-3 shadow-2xl px-4 rounded-xl font-semibold"><Link to='signin'>
              Sign up now
              </Link>
            </button>
              </>

            ):
           <button className="bg-green-600 text-white py-3 px-4 md:text-lg rounded-xl font-bold">
            <Link to='/trade-listings'>
              Explore Trade offers
            </Link>
            </button>
            
            }
           
          </div>
        </div>

        {/* Right Side - Globe Image */}
        <div className="relative w-[58%] hidden lg:flex">
          <img
            src="bg.png"
            alt="World Map"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;