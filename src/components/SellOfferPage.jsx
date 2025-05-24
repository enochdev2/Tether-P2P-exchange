import React, { useState } from "react";

const SellOfferPage = () => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [pricePerUSDT, setPricePerUSDT] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [minLimit, setMinLimit] = useState("");
  const [maxLimit, setMaxLimit] = useState("");
  const [location, setLocation] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle offer submission logic
    console.log("Offer Submitted");
  };

  return (
    <div className=" mx-auto">
      <div className=" mx-auto">
        {/* <h2 className="text-2xl font-semibold text-amber-50">
          Place an Offer to Sell USDT
        </h2> */}

        {/* Exchange Rate Section */}
        <div className="flex justify-between bg-green-800 px-4 py-2 rounded-lg mb-4">
          <div className="text-lg font-semibold text-gray-100">
            Current Exchange Rate
          </div>
          <div className="text-xl font-bold text-green-100">
            1 USDT = 1,435.5 KRW
          </div>
        </div>
      </div>

      <div className=" mx-auto text-white">
        {/* Form for creating a new offer */}
        <form onSubmit={handleSubmit}>
          {/* Amount of USDT */}
          <div className="mb-2">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-200"
            >
              Amount of USDT to Sell
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              className="w-full p-3 mt-2 border rounded-lg"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {/* Payment Method */}
          <div className="mb-2">
            <label
              htmlFor="paymentMethod"
              className="block text-sm font-medium text-gray-100"
            >
              Payment Method
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              className="w-full p-3 mt-2 border rounded-lg bg-black/50"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            >
              <option value="">Select Payment Method</option>
              <option value="PayPal">PayPal</option>
              <option value="Bank Transfer">Bank Transfer</option>
              {/* Add other payment methods as needed */}
            </select>
          </div>

          {/* Price per USDT */}
          <div className="mb-2 ">
            <label
              htmlFor="pricePerUSDT"
              className="block text-sm font-medium text-gray-100"
            >
              Price per USDT (in KRW)
            </label>
            <input
              type="number"
              id="pricePerUSDT"
              name="pricePerUSDT"
              className="w-full p-3 mt-2 border rounded-lg"
              value={pricePerUSDT}
              onChange={(e) => setPricePerUSDT(e.target.value)}
              required
            />
          </div>

          {/* Transaction Limitations */}
          <div className="mb-2 flex space-x-4">
            <div className="w-1/2">
              <label
                htmlFor="minLimit"
                className="block text-sm font-medium text-gray-100"
              >
                Minimum Trade Amount (KRW)
              </label>
              <input
                type="number"
                id="minLimit"
                name="minLimit"
                className="w-full p-3 mt-2 border rounded-lg"
                value={minLimit}
                onChange={(e) => setMinLimit(e.target.value)}
              />
            </div>

            <div className="w-1/2">
              <label
                htmlFor="maxLimit"
                className="block text-sm font-medium text-gray-700"
              >
                Maximum Trade Amount (KRW)
              </label>
              <input
                type="number"
                id="maxLimit"
                name="maxLimit"
                className="w-full p-3 mt-2 border rounded-lg"
                value={maxLimit}
                onChange={(e) => setMaxLimit(e.target.value)}
              />
            </div>
          </div>

          {/* Location */}
      

          {/* Verified Buyers Only */}
          <div className="mb-2 flex items-center space-x-2">
            <input
              type="checkbox"
              id="verifiedOnly"
              checked={verifiedOnly}
              onChange={() => setVerifiedOnly(!verifiedOnly)}
            />
            <label htmlFor="verifiedOnly" className="text-sm">
              Only Allow Verified Buyers
            </label>
          </div>

          {/* Submit Button */}
          <div className="mb-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded-lg w-full"
            >
              Post Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellOfferPage;
