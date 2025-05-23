const BuyTetherComponent = () => {
  return (
    <div className="p-6 bg-white shadow-lg rounded-md mb-6 md:mb-8">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900">
        Trade your Tether (USDT).
      </h1>

      {/* Description */}
      <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
        Trade Tether with over 500 payment methods to choose from, including bank transfers, online wallets, and gift cards.
      </p>

      {/* Promoted Offers Section */}
      <button
        className="w-full py-3 bg-green-800 hover:bg-green-700 transition-colors duration-300 font-semibold text-white rounded-md focus:outline-none focus:ring-4 focus:ring-[#26a17b]/50"
        aria-label="Promoted offers"
      >
        Promoted offers
      </button>
    </div>
  );
};

export default BuyTetherComponent;
