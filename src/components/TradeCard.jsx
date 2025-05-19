import { CheckCircle, Clock, Star } from 'lucide-react';


const TradeCard = ({ offer }) => {
  return (
    <div className="bg-white p-4 shadow-md flex justify-between items-center rounded-md mb-4">
      {/* Left Section (Trader Info) */}
      <div className="flex items-center space-x-4">
        {/* Trader's Name and Rating */}
        <div className="font-semibold text-gray-800">{offer.trader}</div>
        <div className="flex items-center space-x-1 text-gray-600">
          <CheckCircle className="w-4 h-4 text-[#26a17b]" />
          <span>{offer.traderRating}</span>
        </div>
        <div className="text-gray-600">Seen {offer.timeAgo}</div>
      </div>

      {/* Middle Section (Payment Info) */}
      <div className="flex flex-col items-center">
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">{offer.paymentMethod}</span>
          {offer.verified && (
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-500">VERIFIED</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4 text-gray-500" />
          <span>{offer.tradeSpeed}</span>
        </div>
      </div>

      {/* Right Section (Price Info & Actions) */}
      <div className="flex flex-col items-center space-y-2">
        <div className="font-semibold text-lg">{offer.pricePerTether}</div>
        <div className="text-gray-500 text-sm">
          Min purchase: {offer.minPurchase} | Max purchase: {offer.maxPurchase}
        </div>
        <div className="flex items-center space-x-2 text-green-500">
          <Star className="w-4 h-4" />
          <button className="bg-[#26a17b] text-white py-1 px-4 rounded-md">Buy</button>
        </div>
      </div>
    </div>
  );
};

export default TradeCard;