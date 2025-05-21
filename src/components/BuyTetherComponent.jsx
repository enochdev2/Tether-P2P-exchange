const BuyTetherComponent = () => {
  return (
    <div className="p-6 bg-white shadow-lg rounded-md">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-2">Trade your Tether (USDT).</h1>

      {/* Description */}
      <p className="text-gray-600 mb-4">
        Trade Tether with over 500 payment methods to choose from, including bank transfers, online wallets, and gift cards.
      </p>

      {/* Promoted Offers Section */}
      <button className="w-full py-3 bg-[#26a17b] font-semibold text-white rounded-md">
        Promoted offers
      </button>
    </div>
  );
};

export default BuyTetherComponent