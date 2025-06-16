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
import logo from "../../assets/SolanaLogo.png";
import { ErrorToast } from "../../utils/Error";
import { useAuth } from "../../utils/AuthProvider";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const TradingOffers = () => {
  const { t } = useTranslation();
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

  const closeModal = () => navigate("/dashboard/sell-history");
  if (isLoading) return <LoadingSpiner />;

  return (
    <div className="relative px-3 sm:px-6 md:px-8">
      {/* Page Heading */}
      <h2 className="text-center from-[#26a17b] to-[#0d4e3a] text-xl sm:text-2xl md:text-3xl font-bold underline bg-gradient-to-b  text-transparent bg-clip-text border border-slate-300 rounded-2xl shadow-xl py-3 mb-6 max-w-4xl mx-auto">
        {t("sellorder.sellOrder")}
      </h2>

      {/* Modal Component */}
      {isModalOpen && (
        <Modal isModalOpen={isModalOpen} closeModal={closeModal}>
          <div className="p-6 sm:p-8 text-center text-base sm:text-lg font-medium text-gray-800">
            Sell Order Form Content
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TradingOffers;

const Modal = ({ isModalOpen, closeModal }) => {
  const { t } = useTranslation();
  const { priceKRW, setPriceKRW } = useAuth();

  const [usdtAmount, setUsdtAmount] = useState("");
  const [wonAmount, setWonAmount] = useState("");
  const [rate, setRate] = useState(priceKRW);
  const [loading, setLoading] = useState(false);
  // const [refreshed, setRefreshed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const [error, setError] = useState(null);
  const [walletAddress, setWalletAddress] = useState(
    "0x1234a0x1234346yr5t64rabcd5678ef901f9012" // Dummy admin wallet address
  );
  const [depositNetwork, setDepositNetwork] = useState("SOL");
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
    }, 2000);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (!refreshing) return;
    const fetchPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=krw"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRate(data.tether.krw);
        setPriceKRW(data.tether.krw);
        return response;
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchPrice().then(() => {
      setLastRefreshed(new Date());
      setRefreshing(false);
    });
  }, [refreshing]);

  if (!isModalOpen) return null;
  // Korean currency button values in won (number format)
  const krwButtons = [10000, 30000, 50000, 100000, 200000, 300000, 500000, 1000000];
  
     // Conditional formatting based on language
    const formatCurrency = (value) => {
      if (i18next.language === 'ko') {
        return `${value / 10000} ${t("sellorder.price")}`; // For Korean, show '만원'
      }
      return `${value / 1000}${t("sellorder.price")}`; // For English, show 'K'
    };


  // When KRW button clicked, set won amount (string) and clear USDT for now
  const handleKRWButtonClick = (value) => {
    const currentWon = Number(wonAmount) || 0;
    const newWonAmount = currentWon + value;
    setWonAmount(newWonAmount.toString());
    const calculatedUSDT = (newWonAmount / rate).toFixed(4);
    setUsdtAmount(calculatedUSDT);
  };

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);

    // Simulate refresh action (e.g., fetching new rate)
    setTimeout(() => {
      setLastRefreshed(new Date());
      setRefreshing(false);
    }, 1000); // 2 seconds delay to simulate loading
  };

  // Copy wallet address to clipboard
  const copyWalletAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    SuccessToast("Successfully Copied");
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
      const token = localStorage.getItem("token");
      const response = await fetch("https://tether-p2p-exchang-backend.onrender.com/api/v1/sell", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          // Add auth tokens here if needed, e.g.:
        },
        // credentials: "include",
        body: JSON.stringify({
          amount: Number(usdtAmount),
          price: Number(rate),
          krwAmount: Number(wonAmount),
          // Add other data fields you want to submit
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || data.message || "Failed to register user";
        ErrorToast(errorMsg);
      }

      // Optionally clear input or close modal
      if (response.ok) {
        setWonAmount("");
        setUsdtAmount("");
        SuccessToast("Successfully placed a sell order");
        closeModal();
      }
    } catch (err) {
      setError("Failed to submit order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="bg-black bg-opacity-70 max-w-4xl mx-auto rounded-lg z-50 flex justify-center items-center py-4 px-3 h-[50hv]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
    >
      <div className="bg-[#181818] rounded-xl w-full max-w-4xl max-h-[75vh] overflow-y-auto text-white font-sans shadow-2xl mx-auto p-4 sm:p-6">
        <div className="border  mt-7   border-gray-700 rounded-xl md:w-[95%] mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center px-4 py-3 gap-1 sm:gap-2 text-xs text-gray-400 border-b border-gray-800">
            <span className="text-[0.8rem]  leading-tight break-words">
              Tether Rate Calculator: <br className="block sm:hidden" />
              As of {lastRefreshed.toLocaleString()} {refreshing && "Refreshing..."}
            </span>
            <button
              className="hover:text-white transition cursor-pointer flex items-center gap-1 self-end"
              aria-label="Refresh rate"
              onClick={handleRefresh}
            >
              <RefreshCcw size={14} className={refreshing ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* Rate display */}
          <div className="flex flex-row items-center sm:justify-between lg:gap-4 gap-2 p-2 lg:p-4">
            {/* KRW Input */}
            <div className="flex items-center bg-[#222222] border border-gray-800 rounded-md px-3 py-2 w-full sm:w-1/2">
              <input
                type="number"
                min={0}
                disabled
                placeholder={rate}
                className="bg-transparent w-full text-white text-right placeholder-gray-100 focus:outline-none text-sm"
                aria-label="Enter amount in won"
              />
              <span className="ml-2 select-none lg:text-xs text-sm text-gray-300">KRW</span>
            </div>

            {/* Equal Icon */}
            <div className="text-orange-300">
              <Equal size={20} lg:size={28} className="font-bold" />
            </div>

            {/* USDT Input */}
            <div className="flex items-center bg-[#222222] border border-gray-800 rounded-md px-3 py-2 w-full sm:w-1/2">
              <div className="rounded-full lg:w-8 lg:h-8 flex items-center justify-center mr-2">
                <img
                  src={logo2}
                  alt="USDT logo"
                  className="lg:w-full lg:h-full w-36 h-6 lg:object-contain"
                />
              </div>
              <input
                type="number"
                min={0}
                disabled
                placeholder="1"
                className="bg-transparent text-right w-full text-white placeholder-gray-100 focus:outline-none text-sm"
                aria-label="Enter amount of USDT"
              />
              <span className="ml-2 lg:text-xs text-[12px] text-white select-none">USDT</span>
            </div>
          </div>
        </div>
        {/* Header: Tether Rate Calculator */}

        {/* Amount to Sell */}
        <div className="flex justify-between mt-7 lg:px-6 mb-1">
          <h4 className="md:text-lg text-sm  font-semibold mb-6"> {t("sellorder.amountToBuy")}</h4>
        </div>

        <div className=" lg:px-6">
          <h4 className="md:text-lg text-sm font-semibold text-gray-500">
            {t("sellorder.enterAmount")}
          </h4>
        </div>

        {error && <div className="ml-6 text-lg text-red-600">{error}</div>}

        {/* Inputs for USDT and won */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5 px-1">
          <div className="flex items-center bg-[#222222] rounded-md px-3 lg:py-2 w-full sm:w-1/2">
            <div className="flex items-center justify-center w-10 h-10 mr-3 rounded-full  select-none">
              <img src={logo2} alt="USDT Logo" className="w-full h-full object-contain" />
            </div>
            <input
              type="number"
              min={0}
              value={usdtAmount}
              onChange={(e) => setUsdtAmount(e.target.value)}
              placeholder="0"
              aria-label="Enter amount of USDT"
              className="bg-transparent w-full text-right text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none"
            />
            <span className="ml-2 text-white select-none text-sm sm:text-base">USDT</span>
          </div>
          <div className="flex items-center justify-center text-orange-400 text-2xl font-bold">
            <Equal size={28} />
          </div>
          <div className="flex items-center bg-[#222222] rounded-md px-3 py-2 w-full sm:w-1/2">
            <input
              type="number"
              min={0}
              value={wonAmount}
              onChange={(e) => setWonAmount(e.target.value)}
              placeholder="0"
              aria-label="Enter amount in won"
              className="bg-transparent w-full text-right text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none"
            />
            <span className="ml-2 text-white select-none text-sm sm:text-base">KRW</span>
          </div>
        </div>

        {/* Korean currency buttons + orange "정정" button */}
        <div className="flex flex-wrap gap-2 px-2 lg:px-6 mb-3">
          {krwButtons.map((val) => (
            <button
              key={val}
              onClick={() => handleKRWButtonClick(val)}
              className={`text-xs cursor-pointer sm:text-sm py-2 px-3 rounded select-none transition 
          ${
            val === 1000000
              ? "bg-gray-300 text-black"
              : "bg-gray-700 text-white hover:bg-green-700 hover:text-white"
          }`}
            >
              {formatCurrency(val)}
            </button>
          ))}
          <button
            onClick={() => {
              setWonAmount("");
              setUsdtAmount("");
            }}
            className="ml-auto bg-green-700 hover:bg-green-800 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded select-none transition cursor-pointer"
            title="정정"
          >
            {t("sellorder.clear")}
          </button>
        </div>

        {/* Deposit Wallet Address */}
        <div className="mb-4 px-1">
          <label
            htmlFor="wallet-address"
            className="block text-xs sm:text-sm font-semibold mb-1 text-gray-400"
          >
            {t("sellorder.depositWalletAddress")}
          </label>
          <div className="relative">
            <input
              id="wallet-address"
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="(Admin Wallet Address)"
              aria-label="Deposit wallet address"
              className="w-full bg-[#222222] rounded-md text-white text-sm sm:text-base px-3 py-2 pr-10 placeholder-gray-400 border border-sky-600/40 focus:outline-none"
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
        <div className="mb-6 px-1 max-w-xs">
          <label
            htmlFor="deposit-network"
            className="block text-xs sm:text-sm font-semibold mb-1 text-gray-400"
          >
            {t("sellorder.depositNetwork")}
          </label>
          <div className="relative flex items-center bg-[#222222] rounded-full px-4 py-2">
            <img src={logo} className="w-5 h-5" alt="" />
            <select
              id="deposit-network"
              className="bg-[#222222] w-full text-white text-sm sm:text-base rounded-full appearance-none focus:outline-none px-2"
              value={depositNetwork}
              onChange={(e) => setDepositNetwork(e.target.value)}
              aria-label="Select deposit network"
            >
              <option value="SOL"> Solana (SOL)</option>
            </select>
            <ArrowDown size={18} className="absolute right-4 pointer-events-none text-white" />
          </div>
          <p className="mt-1 text-gray-500 text-[10px] sm:text-xs">{t("sellorder.solanaOnly")}</p>
        </div>

        {/* Scrollable Notice text & Checkbox */}
        <div className="px-6 mb-6 flex-1  border border-gray-700 rounded-md bg-[#111111] p-4 text-xs text-gray-300">
          <p className="font-semibold mb-2 text-sm sm:text-base">
            <strong></strong> {t("sellorder.noticeTitle")}
          </p>
          <ul className="list-disc text-justify list-inside space-y-2 text-[11px] sm:text-sm leading-relaxed">
            <li>{t("sellorder.noticePoints.checkAddress")}</li>
            <li>{t("sellorder.noticePoints.wrongAddress")}</li>
            <li>{t("sellorder.noticePoints.solanaSupport")}</li>
            <li>{t("sellorder.noticePoints.otherChainsUnsupported")}</li>
            <li>{t("sellorder.noticePoints.usdtRateVaries")}</li>
            <li>{t("sellorder.noticePoints.usdtFixedPriceNote")}</li>
          </ul>

          {/* Confirmation Checkbox */}
          <label className="mt-4 flex flex-col  justify-center items-center  gap-1 cursor-pointer text-gray-300 select-none">
            <span className="text-[12px] md:text-[15px] text-justify font-semibold">
              {t("sellorder.confirmationText")}
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
            className="bg-[#333333] text-white px-6 py-2 rounded hover:bg-[#555555] cursor-pointer transition"
            type="button"
          >
            {t("sellorder.cancel")}
          </button>
          <button
            onClick={submitOrder}
            type="button"
            disabled={!agreed}
            className={`px-8 py-2 cursor-pointer rounded text-white transition ${
              agreed ? "bg-[#037926] hover:bg-green-700" : "bg-[#037926]/60 cursor-not-allowed"
            }`}
          >
            {loading ? <LoadingSpinner /> : `${t("sellorder.submit")}`}
          </button>
        </div>
      </div>
    </div>
  );
};
