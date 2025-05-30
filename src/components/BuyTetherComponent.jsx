const BuyTetherComponent = () => {
  return (
    <div className="p-4 sm:py-4 bg-white shadow-md rounded-md mb-3">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
        Trade your Tether (USDT).
      </h1>
      {/* <p className="text-gray-600 text-sm sm:text-base mb-4">
        Trade Tether with over 500 payment methods to choose from, including bank transfers, online wallets, and gift cards.
      </p> */}
      <button
        className="w-full py-3 text-sm sm:text-base bg-green-800 hover:bg-green-700 transition-colors duration-300 font-semibold text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#26a17b]/50"
      >
        Fast Transaction
      </button>
    </div>
  );
};

export default BuyTetherComponent;
