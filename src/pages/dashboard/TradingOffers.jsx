import {
  ArrowDown,
  Copy,
  Equal,
  PiIcon,
  RefreshCcw
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpiner from "../../components/LoadingSpiner";
import { SuccessToast } from "../../utils/Success";


const TradingOffers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
   const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsModalOpen(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => navigate("/dashboard/sell-history");
  if (isLoading) return <LoadingSpiner />;

  return (
    <div className="relative">
      <h2 className="text-xl md:text-3xl bg-gradient-to-b from-purple-700 to-pink-600 text-transparent bg-clip-text font-bold  underline mb-8 rounded-2xl text-center border  border-slate-300 py-3 shadow-xl md:w-4xl mx-auto">
        Buy Order
      </h2>

      {/* Modal Component */}
      {isModalOpen && (
        <Modal isModalOpen={isModalOpen} closeModal={closeModal}>
          {/* Your modal content here */}
          <div className="p-4 text-center text-lg font-medium">
            Sell Order Form Content
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TradingOffers;

const Modal = ({ isModalOpen, closeModal }) => {
  if (!isModalOpen) return null;

  const [usdtAmount, setUsdtAmount] = useState("");
  const [wonAmount, setWonAmount] = useState("");
  const [rate, setRate] = useState("1435.5");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  const [walletAddress, setWalletAddress] = useState(
    "0x1234a0x1234346yr5t64rabcd5678ef901f9012" // Dummy admin wallet address
  );
  const [depositNetwork, setDepositNetwork] = useState("SOL");
  const [agreed, setAgreed] = useState(false);

  // Korean currency button values in won (number format)
  const krwButtons = [
    10000, 30000, 50000, 100000, 200000, 300000, 500000, 1000000,
  ];

   useEffect(() => {
        const timer = setTimeout(() => {
          setError(null);
        }, 2000);
    
        return () => clearTimeout(timer);
      }, [error]);

 
  // When KRW button clicked, set won amount (string) and clear USDT for now
  const handleKRWButtonClick = (value) => {
    setWonAmount(value.toString());
    const calculatedUSDT = (value / rate).toFixed(4);
    setUsdtAmount(calculatedUSDT);
  };

  // Copy wallet address to clipboard
  const copyWalletAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    SuccessToast("Successfully Copied");
  };

  

  return (
    <div
      className=" bg-black bg-opacity-70 max-w-[920px] z-50 flex justify-center items-center py-2 rounded-2xl mx-auto overflow-auto"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
    >
      <div className="bg-[#181818] rounded-md max-w-4xl w-full max-h-[60vh] overflow-auto flex flex-col text-white font-sans">
        <div className="border  mt-5   border-gray-700 rounded-xl md:w-[95%] mx-auto">
          <div className="flex justify-start space-x-4 items-center px-3 pt-3  text-xs text-gray-400 ">
            <span>Tether Rate Calculator: As of May 19, 2025, 11:41 PM</span>
            <button
              className="hover:text-white transition"
              aria-label="Refresh rate"
              onClick={() => alert("Refresh clicked")}
            >
              <RefreshCcw size={16} />
            </button>
          </div>

          {/* Rate display */}
          <div className="flex items-center space-x-4 rounded-md mx-1 my-2  p-3">
            <div className="bg-[#222222] rounded-md px-3 py-2 flex border border-gray-800 items-center w-1/2 text-white">
              <input
                type="number"
                min={0}
                disabled={true}
                value={wonAmount}
                onChange={(e) => setWonAmount(e.target.value)}
                placeholder="1435.5"
                className="bg-transparent w-full text-white text-right placeholder-gray-400 focus:outline-none text-sm"
                aria-label="Enter amount in won"
              />
              <span className="ml-2 select-none">KRW</span>
            </div>
            <Equal size={28} className="text-orange-300 font-bold" />
            <div className="flex items-center bg-[#222222] border border-gray-800 rounded-md px-3 py-2 w-1/2">
              <div className="bg-[#0A693E] rounded-full w-9 h-7 flex items-center justify-center mr-2 text-white font-bold select-none">
                T
              </div>
              <input
                type="number"
                min={0}
                disabled={true}
                value={usdtAmount}
                onChange={(e) => setUsdtAmount(e.target.value)}
                placeholder="1"
                className="bg-transparent text-right w-full text-white placeholder-gray-100 focus:outline-none text-sm"
                aria-label="Enter amount of USDT"
              />
              <span className="ml-2 text-white select-none">USDT</span>
            </div>
          </div>
        </div>
        {/* Header: Tether Rate Calculator */}

        {/* Amount to Sell */}
        <div className="flex justify-between mt-9 px-6 mb-1">
          <h4 className="md:text-lg text-sm  font-semibold mb-6">
            Amount to Sell
          </h4>
        </div>

        <div className=" px-8">
          <h4 className="md:text-lg text-sm font-semibold text-gray-500">
            Enter Amount of USDT
          </h4>
        </div>

        {/* Inputs for USDT and won */}
        <div className="flex gap-3 px-6 mb-4 items-center">
          <div className="flex items-center bg-[#222222] rounded-md px-3 py-2 w-1/2">
            <div className="bg-[#0A693E] rounded-full w-8 h-6 flex items-center justify-center mr-2 text-white font-bold select-none">
              T
            </div>
            <input
              type="number"
              min={0}
              value={usdtAmount}
              onChange={(e) => setUsdtAmount(e.target.value)}
              placeholder="0"
              className="bg-transparent text-right w-full text-white placeholder-gray-400 focus:outline-none text-sm"
              aria-label="Enter amount of USDT"
            />
            <span className="ml-2 text-white select-none">USDT</span>
          </div>
          <Equal size={28} className="text-orange-300 font-bold" />
          <div className="bg-[#222222] rounded-md px-3 py-2 flex items-center w-1/2 text-white">
            <input
              type="number"
              min={0}
              value={wonAmount}
              onChange={(e) => setWonAmount(e.target.value)}
              placeholder="0"
              className="bg-transparent w-full text-white text-right placeholder-gray-400 focus:outline-none text-sm"
              aria-label="Enter amount in won"
            />
            <span className="ml-2 select-none">KRW</span>
          </div>
        </div>

        {/* Korean currency buttons + orange "정정" button */}
        <div className="flex flex-wrap gap-2 px-6 mb-3">
          {krwButtons.map((val) => (
            <button
              key={val}
              onClick={() => handleKRWButtonClick(val)}
              className={`text-xs md:text-base py-2 px-2 rounded-sm select-none ${
                val === 1000000
                  ? "bg-[#CCCCCC] text-black"
                  : "bg-[#444444] text-white"
              } hover:bg-[#FF5722] hover:text-white transition`}
            >
              {val / 10000} k
            </button>
          ))}
          <button
            className="ml-auto bg-[#FF5722] text-white text-xs px-3 py-1 rounded-md hover:bg-[#E64A19] transition select-none"
            title="정정"
          >
            Clear
          </button>
        </div>

        {/* Deposit Wallet Address */}
        <div className="px-6 mb-2">
          <label
            htmlFor="wallet-address"
            className="block text-xs md:text-lg font-semibold mb-1 text-gray-300"
          >
            Deposit Wallet Address
          </label>
          <div className="relative">
            <input
              id="wallet-address"
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="(Admin Wallet Address)"
              className="w-full bg-[#222222] rounded-md text-white text-sm px-3 py-2 pr-10 placeholder-gray-400 focus:outline-none border border-sky-600/40"
              aria-label="Deposit wallet address"
            />
            <button
              onClick={copyWalletAddress}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
              aria-label="Copy Wallet Address"
              type="button"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>

        {/* Deposit Network */}
        <div className="px-6 mb-4">
          <label
            htmlFor="deposit-network"
            className="block text-xs md:text-sm font-semibold mb-1"
          >
            Deposit Network
          </label>
          <div className="flex relative items-center bg-[#222222] mb-4  w-80 rounded-full px-4">
            <PiIcon size={18} />
            <select
              id="deposit-network"
              className="bg-[#222222] absolute left-0 z-1 top-0 px-3 py-1 rounded-full text-white w-full text-sm focus:outline-none appearance-none"
              value={depositNetwork}
              onChange={(e) => setDepositNetwork(e.target.value)}
              aria-label="Select deposit network"
            >
              <option value="SOL">
                {/* Solana icon on left with text */}
                Solana (SOL)
              </option>
            </select>
            <ArrowDown size={18} />
          </div>
          <p className="text-gray-400 mt-1 text-[11px]">
            Only one Solana chain can be selected (using a dropdown menu).
          </p>
        </div>

        {/* Scrollable Notice text & Checkbox */}
        <div className="px-6 mb-6 flex-1  border border-gray-700 rounded-md bg-[#111111] p-4 text-xs text-gray-300">
          <p className="text-[14px] md:text-[15px]">
            <strong>[Notice]</strong> Please read the following carefully before
            proceeding to the next step.
          </p>
          <ul className="list-disc text-[12px] md:text-[14px] list-inside mt-2 space-y-3">
            <li>
              Before making a deposit, make sure the copied wallet address is
              correct. After copying the address, paste it into a memo or
              another place to double-check.
            </li>
            <li>
              If you deposit to the wrong wallet address, we will not be able to
              recover the funds.
            </li>
            <li>
              Only deposits through the Solana (SOL) chain are supported. Please
              note that both exchange platforms like Binance and Bybit, as well
              as personal wallets (Phantom Wallet), support Solana deposits and
              withdrawals.
            </li>
            <li>
              Deposits made through other chains (such as TRC-20, ERC-20, etc.)
              are not supported.
            </li>
            <li>
              The price of USDT (Tether) is subject to change based on the rates
              of Korean exchanges.
            </li>
            <li>
              Please note that the USDT rate may slightly vary depending on the
              transaction completion time, even if the price was fixed at the
              time of your sale registration.
            </li>
          </ul>

          {/* Confirmation Checkbox */}
          <label className="mt-4 flex flex-col  justify-center items-center  gap-1 cursor-pointer text-gray-300 select-none">
            <span className="text-[12px] md:text-[15px] font-semibold">
              I hereby acknowledge that I have carefully read and understood all
              of the above notices. I fully accept that failure to comply with
              these instructions may result in financial loss, for which I take
              full responsibility.
            </span>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-[3px] w-4 h-4 bg-[#222222] border border-gray-600 rounded-sm focus:ring-[#FF5722]"
              aria-required="true"
            />
          </label>
        </div>

        {/* Buttons - fixed at bottom */}
        <div className="flex justify-center  bottom-0 gap-3 px-6 py-4 border-t border-gray-700 bg-[#181818] rounded-b-md">
          <button
            onClick={closeModal}
            className="bg-[#333333] text-white px-6 py-2 rounded hover:bg-[#555555] transition"
            type="button"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!agreed}
            className={`px-8 py-2 rounded text-white transition ${
              agreed
                ? "bg-[#FF5722] hover:bg-[#E64A19]"
                : "bg-[#FF5722]/60 cursor-not-allowed"
            }`}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
