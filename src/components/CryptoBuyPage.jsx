import React, { useState } from "react";
import { Coins, Send } from "lucide-react";

export default function CryptoBuyPage() {
  const [amount, setAmount] = useState("");
  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and dot
    if (/^\d*\.?\d*$/.test(value)) setAmount(value);
  };

  return (
    <div className="bg-white min-h-screen px-4 sm:px-6 lg:px-12 py-10 text-black font-sans">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          Exchange your <span className="text-green-700">USDT</span> instantly
        </h1>
        <p className="text-gray-500 text-base sm:text-lg md:text-xl font-medium mt-2">
          Trade USDT with different payment methods
        </p>
      </div>

      {/* Form */}
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:flex-wrap gap-4 md:gap-3 justify-center items-center bg-gray-100 px-6 py-5 rounded-3xl shadow-sm">
          {/* Buy/Sell */}
          <div className="flex items-center gap-2 text-sm">
            <label className="text-gray-500">I want to</label>
            <select className="rounded-full bg-white px-3 py-1 border text-sm">
              <option>Buy</option>
              <option>Sell</option>
            </select>
          </div>

          {/* Coin Select */}
          <div className="flex items-center gap-2 text-sm bg-white rounded-full px-4 py-1 shadow">
            <Coins className="text-orange-500 w-4 h-4" />
            <span>Tether</span>
            <select className="border-none bg-transparent text-black outline-none">
              <option>USDT</option>
            </select>
          </div>

          {/* Amount Input */}
          <div className="flex items-center gap-2 text-sm">
            <label className="text-gray-500">for</label>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Amount"
              className="rounded-full bg-white px-4 py-1 text-center w-24 text-sm border outline-none shadow"
            />
          </div>

          {/* Currency */}
          <div className="flex items-center gap-2 text-sm bg-white rounded-full px-4 py-1 shadow">
            <img
              src="https://flagcdn.com/us.svg"
              alt="usd"
              className="w-5 h-5 rounded-full"
            />
            <select className="border-none bg-transparent text-black outline-none">
              <option value="KRW">KRW</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>

          {/* Payment Method */}
          <div className="flex items-center gap-2 text-sm">
            <label className="text-gray-500">with</label>
            <select className="rounded-full bg-white px-4 py-1 text-sm border shadow">
              <option>All payment methods</option>
              <option>Bank Transfer</option>
              <option>PayPal</option>
              <option>Apple Pay</option>
            </select>
          </div>

          {/* Button */}
          <button className="bg-green-800 cursor-pointer ease-in-out transition-all duration-300 hover:bg-green-600 text-white px-6 py-2 text-sm font-medium rounded-full mt-2 md:mt-0">
            Find offers
          </button>
        </div>

        {/* Exchange Rate Info */}
        <div className="mt-4 flex justify-center items-center gap-2 text-sm text-gray-600">
          <img src="/Tether2.png" alt="USDT" className="w-6 h-6" />
          <span className="font-semibold text-black">USDT / ₩1,435.5</span>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-20 flex flex-col items-center text-center px-4 sm:px-0">
        <Send className="w-10 h-10 text-green-800 mb-4" />
        <h2 className="text-2xl sm:text-3xl font-semibold mb-2">
          Send money instantly – get USDT instantly
        </h2>
        <p className="text-gray-500 max-w-md text-sm sm:text-base">
          Send and receive USDT securely with Tether Zone, anywhere in the
          world.
        </p>
        <button className="mt-6 bg-green-800 ease-in-out transition-all duration-300 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg">
          Get your wallet
        </button>
      </div>
    </div>
  );
}
