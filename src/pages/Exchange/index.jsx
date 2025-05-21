import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, ChevronDown, Star } from 'lucide-react'; 
import TradeCard from '../../components/TradeCard';
import BuyTetherComponent from '../../components/BuyTetherComponent';

const TradingPage = () => {
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
    <div className="flex bg-gray-100 pt-18 min-h-screen">
      {/* Sidebar Section */}
      <div className="w-1/4 bg-white p-6 shadow-lg space-y-6">
        <h2 className="text-2xl font-semibold">Find Offers</h2>
        {/* Filters */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span>Tether</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <div className="flex items-center space-x-2">
            <span>All Payment Methods</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <div>
            <input
              type="number"
              placeholder="Enter amount"
              className="w-full p-2 border rounded-md mt-2"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span>Offer Location</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <div className="flex items-center space-x-2">
            <span>Trader Location</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <div className="flex items-center space-x-2">
            <span>Recently Active Traders</span>
            <input type="checkbox" />
          </div>
          <div className="flex items-center space-x-2">
            <span>Verified Offers</span>
            <input type="checkbox" />
          </div>
        </div>

        {/* Find Offers Button */}
        <button
          onClick={() => handleLinkClick("findOffers")}
          className="w-full py-3 bg-green-500 text-white rounded-md mt-6"
        >
          Find Offers
        </button>
      </div>

      {/* Main Content Section */}
      <div className="flex-1 p-6 overflow-y-auto">
        <BuyTetherComponent/>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Trade Listings</h1>

          <div className="space-x-4">
            <button className="bg-gray-200 px-4 py-2 rounded-md">Sort By</button>
            <button className="bg-gray-200 px-4 py-2 rounded-md">Take Tour</button>
          </div>
        </div>

        {/* Map Over Offers Data */}
        <div className="space-y-4">
          {offers.map((offer) => (
            <TradeCard key={offer.id} offer={offer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TradingPage;

