import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import BuyTetherComponent from './BuyTetherComponent';
import TradeCard from './TradeCard';

const History = () => {
 
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
    <div>
        <div className='block w-full'>
 {/* Filters and Export Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button className="py-2 px-4 bg-gray-200 rounded-md">Filters</button>
              <button className="py-2 px-4 bg-gray-200 rounded-md">Export Trades</button>
            </div>
            <div className="flex space-x-4">
              <p className="text-sm">Completed Trades: 0%</p>
              <p className="text-sm">(0 trades out of 0)</p>
            </div>
          </div>
        </div>

        {/* My Past Trades */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">My Past Trades</h2>
          <div className="text-center text-gray-500">
            <p>You haven’t traded yet.</p>
            <p className="mt-2 text-gray-600">Start trading now!</p>
          </div>
        </div>
        </div>

      <div className="flex bg-gray-100 pt-18 min-h-screen">
        

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
    </div>
  );
};



export default History