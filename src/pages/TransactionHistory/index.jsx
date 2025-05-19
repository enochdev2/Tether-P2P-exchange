import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, ChevronDown, Star } from 'lucide-react'; 
import TradeCard from '../../components/TradeCard';
import BuyTetherComponent from '../../components/BuyTetherComponent';

const TransactionHistory = () => {
 
  const [activeLink, setActiveLink] = useState("findOffers");

  // Example data for trading offers
  const offers = [
    {
      id: 1,
      trader: "JEB_FOREX",
      traderRating: 3213,
      paymentMethod: "MTN Mobile Money",
      verified: true,
      tradeSpeed: "Under a minute",
      pricePerTether: "15.19 GHS",
      minPurchase: "156 GHS",
      maxPurchase: "640 GHS",
      timeAgo: "1 hour ago",
      priceChange: "-1%",
    },
    {
        id: 2,
        trader: "JEB_FOREX",
      traderRating: 3213,
      paymentMethod: "Momo",
      verified: true,
      tradeSpeed: "Under a minute",
      pricePerTether: "15.19 GHS",
      minPurchase: "156 GHS",
      maxPurchase: "640 GHS",
      timeAgo: "1 hour ago",
      priceChange: "-1%",
    },
    {
        id: 3,
        trader: "JEB_FOREX",
        traderRating: 3213,
      paymentMethod: "Vodafone Cash Payment",
      verified: true,
      tradeSpeed: "2 min",
      pricePerTether: "15.19 GHS",
      minPurchase: "156 GHS",
      maxPurchase: "640 GHS",
      timeAgo: "1 hour ago",
      priceChange: "-1%",
    },
    {
      id: 4,
      trader: "PetiteTrahira576",
      traderRating: 3213,
      paymentMethod: "Skrill",
      verified: false,
      tradeSpeed: "Under a minute",
      pricePerTether: "1 USD",
      minPurchase: "10 USD",
      maxPurchase: "13 USD",
      timeAgo: "5 hours ago",
      priceChange: "-0.24%",
    },
    {
        id: 5,
        trader: "PetiteTrahira576",
      traderRating: 3213,
      paymentMethod: "Neteller",
      verified: false,
      tradeSpeed: "Under a minute",
      pricePerTether: "1 USD",
      minPurchase: "10 USD",
      maxPurchase: "13 USD",
      timeAgo: "5 hours ago",
      priceChange: "-0.24%",
    },
    {
        id: 6,
      trader: "PetiteTrahira576",
      traderRating: 3213,
      paymentMethod: "Paysera Money Transfer",
      verified: false,
      tradeSpeed: "Under a minute",
      pricePerTether: "1.01 USD",
      minPurchase: "10 USD",
      maxPurchase: "13 USD",
      timeAgo: "5 hours ago",
      priceChange: "-0.75%",
    },
  ];

  const handleLinkClick = (link) => {
    setActiveLink(link); // Set active link when clicked
  };
  
  return (
      <div className="flex bg-gray-100 pt-18 min-h-screen">
      {/* Sidebar Section */}
      <div className="w-1/4 bg-white p-6 shadow-lg space-y-6">
        <h2 className="text-2xl font-bold">Find Transaction History</h2>
        {/* Filters */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span>Tether</span>
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
            <span>Trader Location</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <div className="flex items-center space-x-2">
            <span>Recently Trade</span>
            <input type="checkbox" />
          </div>
          <div className="flex items-center space-x-2">
            <span>Pending Offers</span>
            <input type="checkbox" />
          </div>
        </div>

        {/* Find Offers Button */}
        <button
          onClick={() => handleLinkClick("findOffers")}
          className="w-full py-3 bg-green-500 text-white rounded-md mt-6"
          >
          Find History
        </button>
      </div>

      {/* Main Content Section */}
      <div className="flex-1 p-6 overflow-y-auto">
        <BuyTetherComponent/>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-600 mt-5">Transaction History</h1>

          <div className="space-x-4">
            <button className="bg-gray-200 px-4 py-2 rounded-md">Sort By</button>
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



export default TransactionHistory