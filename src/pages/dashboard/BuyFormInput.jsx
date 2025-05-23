import React, { useState } from "react";
import SellOfferPage from "../../components/SellOfferPage";
import {
  ArrowDown,
  ArrowDownNarrowWide,
  Copy,
  Equal,
  Icon,
  PiIcon,
  RefreshCcw,
  X,
} from "lucide-react";
import { useEffect } from "react";
import LoadingSpiner from "../../components/LoadingSpiner";
import { SuccessToast } from "../../utils/Success";
import logo2 from "../../assets/Tether2.png";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const BuyFormInput = () => {
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
  const closeModal = () => navigate("/dashboard/buy-history");
  if (isLoading) return <LoadingSpiner />;

  return (
    <div className="relative">
      <h2 className="text-xl md:text-3xl bg-gradient-to-b from-purple-700 to-pink-600 text-transparent bg-clip-text font-bold  underline mb-8 rounded-2xl text-center border  border-slate-300 py-3 shadow-xl md:w-4xl mx-auto">
        Buy Order
      </h2>

      {/* Modal Component */}
      {isModalOpen && (
        <Modal isModalOpen={isModalOpen} closeModal={closeModal}></Modal>
      )}
    </div>
  );
};

export default BuyFormInput;

const Modal = ({ isModalOpen, closeModal }) => {
  if (!isModalOpen) return null;
   

  const [usdtAmount, setUsdtAmount] = useState("");
  const [wonAmount, setWonAmount] = useState("");
  const [rate, setRate] = useState("1435.5");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [walletAddress, setWalletAddress] = useState(
    "0x1234346yr5t64rabcd5678ef9012" // Dummy admin wallet address
  );
  const [depositNetwork, setDepositNetwork] = useState("SOL");
  const [agreed, setAgreed] = useState(false);

  // Korean currency button values in won (number format)
  const krwButtons = [
    10000, 30000, 50000, 100000, 200000, 300000, 500000, 1000000,
  ];

  //   const krwButtons = [
  //   "₩10,000",
  //   "₩30,000",
  //   "₩50,000",
  //   "₩100,000",
  //   "₩200,000",
  //   "₩300,000",
  //   "₩500,000",
  //   "₩1,000,000",
  // ];

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

  const validateInputs = () => {
    if (!wonAmount || isNaN(wonAmount) || Number(wonAmount) <= 0) {
      setError("Please enter a valid KRW amount greater than 0.");
      return false;
    }
    if (!usdtAmount || isNaN(usdtAmount) || Number(usdtAmount) <= 0) {
      setError("USDT amount must be greater than 0.");
      return false;
    }
    // Optional: check if usdtAmount roughly matches wonAmount / rate
    const expectedUSDT = Number(wonAmount) / rate;
    const diff = Math.abs(expectedUSDT - Number(usdtAmount));
    if (diff > 0.01) {
      setError("USDT amount does not match KRW amount and rate.");
      return false;
    }
    setError(null);
    return true;
  };

  async function submitOrder() {
    setLoading(true);
    setError(null);

    if (!validateInputs()) {
      setLoading(false);
      return; // Stop submission if validation fails
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/buy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add auth tokens here if needed, e.g.:
            // "Authorization": `Bearer ${token}`
          },
          credentials: "include",
          body: JSON.stringify({
            amount: Number(usdtAmount),
            krwAmount: Number(wonAmount),
            price: Number(rate),
            // Add other data fields you want to submit
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Order submitted successfully:", data);

      // Optionally clear input or close modal
      setWonAmount("");
      setUsdtAmount("");
      SuccessToast("Successfully placed a buy order")
      closeModal();
    } catch (err) {
      console.error("Failed to submit order:", err);
      setError("Failed to submit order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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
                // value={wonAmount}
                // onChange={(e) => setWonAmount(e.target.value)}
                placeholder={rate}
                className="bg-transparent w-full text-white text-right placeholder-gray-100 focus:outline-none text-sm"
                aria-label="Enter amount in won"
              />
              <span className="ml-2 select-none">KRW</span>
            </div>
            <Equal size={28} className="text-orange-300 font-bold" />
            <div className="flex items-center bg-[#222222] border border-gray-800 rounded-md px-3 py-2 w-1/2">
              <div className=" rounded-full w-9 h-6 flex items-center justify-center mr-2 text-white font-bold select-none">
                <span>
                  <img src={logo2} alt="" className="w-8 h-8" />
                </span>
              </div>
              <input
                type="number"
                min={0}
                disabled={true}
                // value={usdtAmount}
                // onChange={(e) => setUsdtAmount(e.target.value)}
                placeholder="1"
                className="bg-transparent text-right w-full text-white placeholder-gray-100 focus:outline-none text-sm"
                aria-label="Enter amount of USDT"
              />
              <span className="ml-2 text-white select-none">USDT</span>
            </div>
          </div>
        </div>
        {/* Header: Tether Rate Calculator */}

        {/* Amount to Buy */}
        <div className="flex justify-between mt-9 px-6 mb-1">
          <h4 className="md:text-lg text-sm  font-semibold mb-6">
            Amount to Buy
          </h4>
        </div>

        <div className=" px-8">
          <h4 className="md:text-lg text-sm font-semibold text-gray-500">
            Enter Amount
          </h4>
        </div>

        {error && <div className="ml-6 text-lg text-red-600">{error}</div> }

        {/* Inputs for USDT and won */}
        <div className="flex gap-3 px-6 mb-4 items-center">
          <div className="flex items-center bg-[#222222] rounded-md px-3 py-2 w-1/2">
            <div className=" rounded-full w-8 h-5 flex items-center justify-center mr-2 text-white font-bold select-none">
              <span>
                <img src={logo2} alt="" className="w-8 h-8" />
              </span>
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
              className={`text-xs md:text-base py-2 px-2 cursor-pointer rounded-sm select-none ${
                val === 1000000
                  ? "bg-[#CCCCCC] text-black"
                  : "bg-[#444444] text-white"
              } hover:bg-[#037926] hover:text-white transition`}
            >
              {val / 10000} k
            </button>
          ))}
          <button
            onClick={() => {
              setWonAmount("");
              setUsdtAmount("");
            }}
            className="ml-auto bg-[#037926] cursor-pointer text-white text-xs md:text-lg font-bold px-3 py-1 rounded-md hover:bg-[#03992a] transition select-none"
            title="정정"
          >
            Clear
          </button>
        </div>

        {/* Buttons - fixed at bottom */}
        <div className="flex justify-center  bottom-0 gap-3 px-6 py-4 border-t border-gray-700 bg-[#181818] rounded-b-md">
          <button
            onClick={closeModal}
            className="bg-[#333333] cursor-pointer text-white px-6 py-2 rounded hover:bg-[#555555] transition"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={submitOrder}
            type="button"
            className={`px-8 py-2 cursor-pointer rounded text-white transition ${"bg-[#037926] hover:bg-green-700"}`}
          >
            {loading ? <LoadingSpinner /> : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};
