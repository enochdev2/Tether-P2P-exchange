import React, { useState } from 'react';
import SellOfferPage from '../../components/SellOfferPage';
import { Copy, RefreshCcw, X } from 'lucide-react';

;

const Modal = ({ isModalOpen, closeModal }) => {
  if (!isModalOpen) return null;

  // State for inputs (for demonstration)
  const [usdtAmount, setUsdtAmount] = useState(0);
  const [wonAmount, setWonAmount] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");
  const [depositNetwork, setDepositNetwork] = useState("SOL");

  // Korean currency buttons
const krwButtons = [
  "₩10,000",  
  "₩30,000",  
  "₩50,000",
  "₩100,000",
  "₩200,000",
  "₩300,000",
  "₩500,000",
  "₩1,000,000" 
];

  const handleKRWButtonClick = (value) => {
    // You can convert KRW to USDT or set wonAmount directly
    setWonAmount(value);
    // update usdtAmount accordingly (not implemented here)
  };

  const copyWalletAddress = () => {
    navigator.clipboard.writeText(walletAddress);
  };

  return (
    <div className=" h-auto bg-black bg-opacity-50 mt-6 flex justify-center items-center z-50">
      <div className="relat bg-[#181818] rounded-md w-[100%] max-h-[470px] p-6 flex flex-col text-white font-sans">
        
        {/* Top Header: Tether Rate Calculator */}
        <div className="text-xs text-gray-400 flex items-center justify-between mb-4">
          <span>Tether Rate Calculator: As of May 19, 2025, 11:41 PM</span>
          <button className="hover:text-white transition">
            <RefreshCcw size={14} />
          </button>
        </div>

        {/* Rate display */}
        <div className="flex items-center border border-gray-700 rounded-md p-3 mb-6">
          <input
            type="text"
            readOnly
            value="1,389.50 won"
            className="bg-transparent text-white w-[150px] text-right pr-2"
          />
          <span className="mx-3 text-gray-400">=</span>
          <div className="bg-[#0A693E] rounded-full flex items-center justify-center w-7 h-7 mr-3">
            {/* Tether logo or text */}
            <span className="text-white font-bold">T</span>
          </div>
          <input
            type="text"
            readOnly
            value="1 USDT"
            className="bg-transparent text-white w-[80px] text-left"
          />
        </div>

        {/* Amount to Sell section */}
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-sm font-semibold">Amount to Sell</h4>
          <h4 className="text-sm font-semibold">Amount</h4>
        </div>

        {/* Inputs side by side */}
        <div className="flex gap-3 mb-3">
          <div className="flex items-center bg-[#222222] rounded-md px-3 py-2 w-1/2">
            <div className="bg-[#0A693E] rounded-full w-6 h-6 flex items-center justify-center mr-2 text-white font-bold">T</div>
            <input
              type="number"
              value={usdtAmount}
              onChange={(e) => setUsdtAmount(e.target.value)}
              placeholder="0"
              className="bg-transparent w-full text-white placeholder-gray-400 focus:outline-none"
            />
            <span className="ml-2 text-white">USDT</span>
          </div>
          <div className="bg-[#222222] rounded-md px-3 py-2 flex items-center w-1/2 text-white">
            <input
              type="number"
              value={wonAmount}
              onChange={(e) => setWonAmount(e.target.value)}
              placeholder="0"
              className="bg-transparent w-full text-white placeholder-gray-400 focus:outline-none"
            />
            <span className="ml-2">won</span>
          </div>
        </div>

        {/* Korean currency buttons + orange button */}
        <div className="flex gap-2 flex-wrap mb-6">
          {krwButtons.map((val, idx) => (
            <button
              key={idx}
              onClick={() => handleKRWButtonClick(val.replace("만원", "0000"))}
              className={`text-xs py-1 px-2 rounded-md ${
                val === "100만원" ? "bg-[#CCCCCC] text-black" : "bg-[#444444] text-white"
              } hover:bg-[#FF5722] hover:text-white transition`}
            >
              {val}
            </button>
          ))}
          <button
            className="ml-auto bg-[#FF5722] text-white text-xs px-3 py-1 rounded-md hover:bg-[#E64A19] transition"
            title="정정"
          >
            정정
          </button>
        </div>

        {/* Deposit Wallet Address */}
        <label className="text-xs font-semibold mb-1">Deposit Wallet Address</label>
        <div className="relative mb-5">
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="(Admin Wallet Address)"
            className="w-full bg-[#222222] rounded-md text-white text-sm px-3 py-2 pr-10 placeholder-gray-400 focus:outline-none"
          />
          <button
            onClick={copyWalletAddress}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            aria-label="Copy Wallet Address"
          >
            <Copy size={16} />
          </button>
        </div>

        {/* Deposit Network */}
        <div className="flex flex-col text-xs mb-6">
          <label className="font-semibold mb-1">Deposit Network</label>
          <select
            className="bg-[#222222] rounded-md px-3 py-2 text-white focus:outline-none appearance-none flex items-center"
            value={depositNetwork}
            onChange={(e) => setDepositNetwork(e.target.value)}
          >
            <option value="SOL" className="flex items-center">
              {/* Display Solana logo inline */}
              Solana (SOL)
            </option>
          </select>
          <span className="text-gray-400 mt-1 text-[11px]">Only one Solana chain can be selected (using a dropdown menu).</span>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={closeModal}
            className="bg-[#333333] text-white px-6 py-2 rounded hover:bg-[#555555] transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#FF5722] text-white px-8 py-2 rounded hover:bg-[#E64A19] transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
const TradingOffers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal
  const openModal = () => setIsModalOpen(true);

  // Function to close the modal
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className='relative'>
      <h3 className="text-xl font-semibold">Trading & Offers</h3>
      <div className="mt-4">
        <button
          onClick={openModal}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Post New Offer
        </button>
        <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 mt-4">
          View Active Offers
        </button>
      </div>

      {/* Modal Component */}
      <Modal isModalOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
};

export default TradingOffers;
