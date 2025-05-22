import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Clock, ChevronDown, Star } from "lucide-react";
import TradeCard from "../../components/TradeCard";
import BuyTetherComponent from "../../components/BuyTetherComponent";

const TransactionHistory = () => {
  const [activeLink, setActiveLink] = useState("findOffers");

  // Example data for trading offers
  const offers = [
    {
      id: 1,
      action: "Sell",
      usdtAmount: 503.56,
      krwAmount: 700000,
      status: "On sell",
      statusDate: "2025-05-20",
    },
    {
      id: 2,
      action: "Sell",
      usdtAmount: 510.12,
      krwAmount: 705000,
      status: "Pending Approval",
      statusDate: "2025-05-19",
    },
    {
      id: 3,
      action: "Sell",
      usdtAmount: 499.98,
      krwAmount: 695000,
      status: "Sell completed",
      statusDate: "2025-05-13",
    },
    {
      id: 4,
      action: "Sell",
      usdtAmount: 503.56,
      krwAmount: 700000,
      status: "Sell completed",
      statusDate: "2025-04-28",
    },
    {
      id: 5,
      action: "Sell",
      usdtAmount: 502.34,
      krwAmount: 699000,
      status: "Sell completed",
      statusDate: "2025-04-20",
    },
    {
      id: 6,
      action: "Sell",
      usdtAmount: 508.44,
      krwAmount: 702000,
      status: "On sell",
      statusDate: "2025-05-20",
    },
  ];

  const handleLinkClick = (link) => {
    setActiveLink(link); // Set active link when clicked
  };

  return (
    <div className="flex mt-18 flex-col md:flex-row bg-gray-100 min-h-screen ">
  {/* Sidebar Section */}
  <aside className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-lg space-y-6 mb-6 md:mb-0">
    <h2 className="text-2xl font-bold text-gray-800">Find Transaction History</h2>
    {/* Filters */}
    <div className="space-y-6">
      <div className="flex justify-between items-center text-gray-700 font-medium cursor-pointer">
        <span>Tether</span>
        <ChevronDown className="w-5 h-5" />
      </div>

      <div>
        <input
          type="number"
          placeholder="Enter amount"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="flex justify-between items-center text-gray-700 font-medium cursor-pointer">
        <span>Trader Location</span>
        <ChevronDown className="w-5 h-5" />
      </div>

      <div className="flex items-center space-x-3 text-gray-700">
        <input type="checkbox" id="recentlyTrade" className="w-5 h-5 text-green-800 focus:ring-green-400" />
        <label htmlFor="recentlyTrade" className="cursor-pointer">Recently Trade</label>
      </div>

      <div className="flex items-center space-x-3 text-gray-700">
        <input type="checkbox" id="pendingOffers" className="w-5 h-5 text-green-800 focus:ring-green-400" />
        <label htmlFor="pendingOffers" className="cursor-pointer">Pending Offers</label>
      </div>
    </div>

    {/* Find Offers Button */}
    <button
      onClick={() => handleLinkClick("findOffers")}
      className="w-full mt-6 py-3 bg-green-800 hover:bg-green-700 text-white font-semibold rounded-md transition-colors duration-300"
    >
      Find History
    </button>
  </aside>

  {/* Main Content Section */}
  <main className="flex-1 bg-white p-6 rounded-lg shadow-lg overflow-y-auto">
    <BuyTetherComponent />

    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-6">
      <h1 className="text-3xl font-bold text-green-800 mb-4 md:mb-0">Transaction History</h1>

      <div>
        <button className="bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-md transition-colors duration-300 font-medium">
          Sort By
        </button>
      </div>
    </div>

    {/* Map Over Offers Data */}
    <div className="space-y-6">
      {offers.map((offer) => (
        <TradeCard key={offer.id} offer={offer} />
      ))}
    </div>
  </main>
</div>

  );
};

export default TransactionHistory;
