import React from 'react';
import { Bitcoin, Coins, Send } from 'lucide-react';

export default function CryptoBuyPage() {
  return (
    <div className="bg-white min-h-screen px-4 md:px-12 py-10 text-black font-sans">

      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-4xl font-semibold mb-2">Exchange your <span className=' text-green-700 font-bold'>usdt</span> instantly</h1>
        <p className="text-gray-500">Trade usdt with different payment methods</p>
      </div>

      {/* Form Section */}
      <div className="mt-10 mx-auto max-w-6xl">
        <div className="rounded-full shadow border flex flex-wrap items-center justify-center gap-3 px-6 py-4">

          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">I want to</span>
            <select className="border-none bg-gray-100 rounded-full px-3 py-1">
              <option>Buy</option>
              <option>Sell</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm bg-gray-100 rounded-full px-4 py-1">
            <Coins className="text-orange-400" />
            <span>Tether</span>
            <select className="border-none bg-transparent">
              <option>Usdt</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">for</span>
            <input
              type="text"
              placeholder="Amount"
              className="border-none bg-gray-100 rounded-full px-3 py-1 w-24 text-center"
            />
          </div>

          <div className="flex items-center gap-2 text-sm bg-gray-100 rounded-full px-4 py-1">
            <img
              src="https://flagcdn.com/us.svg"
              alt="usd"
              className="w-5 h-5 rounded-full"
            />
            <select className="border-none bg-transparent">
              <option>KRW</option>
              {/* <option>EUR</option> */}
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">with</span>
            <select className="border-none bg-gray-100 rounded-full px-4 py-1">
              <option>All payment methods</option>
            </select>
          </div>

          <button className="bg-green-700 hover:bg-green-600 text-black font-medium px-5 py-2 rounded-full text-sm">
            Find offers
          </button>
        </div>

        <div className="text-center w-full flex justify-center items-center space-x-2 text-gray-400 text-xs mt-2">
          
              <span>
                <img src="Tether2.png" alt="" className="w-8 h-8" />
              </span>
              <span className="text-sm font-semibold text-black ">USDT/₩1,435.5</span>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-28 flex flex-col items-center text-center">
        <Send className="text-3xl mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Send money instantly – get usdt instantly</h2>
        <p className="text-gray-500 max-w-md">
          Send, and receive  USDT with Tether Zone.
        </p>
        <button className="mt-6 bg-green-800 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-full">
          Get your wallet
        </button>
      </div>

    </div>
  );
}
