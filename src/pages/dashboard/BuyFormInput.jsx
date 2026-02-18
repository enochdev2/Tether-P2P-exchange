import i18next from "i18next";
import { Equal, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import logo2 from "../../assets/Tether2.png";
import LoadingSpiner from "../../components/LoadingSpiner";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Bankend_Url, useAuth } from "../../utils/AuthProvider";
import { ErrorToast } from "../../utils/Error";
import { SuccessToast } from "../../utils/Success";

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

  // const openModal = () => setIsModalOpen(true);
  const closeModal = () => navigate("/dashboard/buy-history");
  if (isLoading) return <LoadingSpiner />;

  return (
    <div className="relative px-3 sm:px-6 md:px-8">
      <h2 className="text-center from-[#26a17b] to-[#0d4e3a] text-xl sm:text-2xl md:text-3xl font-bold underline bg-gradient-to-b  text-transparent bg-clip-text border border-slate-300 rounded-2xl shadow-xl py-3 mb-8 max-w-4xl mx-auto">
        Buy Order
      </h2>

      {/* Modal Component */}
      {isModalOpen && <Modal isModalOpen={isModalOpen} closeModal={closeModal}></Modal>}
    </div>
  );
};

export default BuyFormInput;

const Modal = ({ isModalOpen, closeModal }) => {
  const { t } = useTranslation();
  const { priceKRW, setPriceKRW } = useAuth();
  const [usdtAmount, setUsdtAmount] = useState("");
  const [wonAmount, setWonAmount] = useState("");
  const [rate, setRate] = useState(priceKRW);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(`${Bankend_Url}/api/v1/tetherprice/get-tether-price`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch tether price");

        const data = await response.json();
        setRate(data.data);
        setPriceKRW(data.data);
        setLastRefreshed(new Date());
      } catch (err) {
        console.log(err.message);
      } finally {
        setRefreshing(false);
      }
    };

    // Initial fetch on mount
    fetchPrice();
  }, []); // ← run only once on mount

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
        const response = await fetch(`${Bankend_Url}/api/v1/tetherprice/get-tether-price`, {
          method: "GET",
          headers: {
            // Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch tether price");
        }
        const data = await response.json();
        setRate(data.data);
        setPriceKRW(data.data);
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
    if (i18next.language === "ko") {
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

  const validateInputs = () => {
    if (!wonAmount || isNaN(wonAmount) || Number(wonAmount) <= 0) {
      setError("Please enter a valid KRW amount greater than 0.");
      return false;
    }
    if (!usdtAmount || isNaN(usdtAmount) || Number(usdtAmount) <= 0) {
      setError("USDT amount must be greater than 0.");
      return false;
    }
    if (!rate || isNaN(rate) || Number(rate) <= 0) {
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
      const response = await fetch(`${Bankend_Url}/api/v1/buy`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          amount: Number(usdtAmount),
          krwAmount: Number(wonAmount),
          price: Number(wonAmount),
          storedLanguage: localStorage.getItem("language"),
          // Add other data fields you want to submit
        }),
      });

      const data = await response.json();
      console.log("🚀 ~ submitOrder ~ data:", data);
      if (!response.ok) {
        const errorMsg = data.error || data.message || "Failed to register user";
        ErrorToast(errorMsg);
      }

      // Optionally clear input or close modal
      setWonAmount("");
      setUsdtAmount("");
      SuccessToast(t("messages.orderPlacedBuy"));
      if (response.ok) {
        closeModal();
      }
    } catch (err) {
      console.error("Failed to submit order:", err);
      setError("Failed to submit order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className=" bg-black bg-opacity-70 max-w-[920px] z-50 flex justify-center items-center px-3 py-3 rounded-2xl mx-auto overflow-auto"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
    >
      <div className="bg-[#181818] rounded-xl w-full max-w-4xl max-h-[85vh] overflow-y-auto text-white font-sans shadow-2xl mx-auto p-4 sm:p-6">
        <div className="border  mt-5   border-gray-700 rounded-xl md:w-[95%] mx-auto">
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
            <div className="flex items-center bg-[#222222] border border-gray-800 rounded-md px-1 py-2 w-full sm:w-1/2">
              <input
                type="number"
                min={0}
                disabled={true}
                // value={wonAmount}
                onChange={(e) => setWonAmount(e.target.value)}
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

            <div className="flex items-center bg-[#222222] border border-gray-800 rounded-md px-3 py-1 lg:py-2 w-full sm:w-1/2">
              <div className="rounded-full lg:w-8 lg:h-8 flex items-center justify-center mr-2  text-white font-bold select-none">
                <img
                  src={logo2}
                  alt=""
                  className="lg:w-full lg:h-full w-30 h-6 lg:object-contain"
                />
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
              <span className="ml-2 lg:text-xs text-[12px] text-white select-none">USDT</span>
            </div>
          </div>
        </div>
        {/* Header: Tether Rate Calculator */}

        {/* Amount to Buy */}
        <div className="flex justify-between mt-9 lg:px-6 mb-1">
          <h4 className="md:text-lg text-sm  font-semibold mb-6">{t("sellorder.amountToSell")}</h4>
        </div>

        <div className=" lg:px-6">
          <h4 className="md:text-lg text-sm font-semibold text-gray-500">
            {" "}
            {t("sellorder.enterAmount")}
          </h4>
        </div>

        {error && <div className="ml-6 text-lg text-red-600">{error}</div>}

        {/* Inputs for USDT and won */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5 px-1">
          <div className="flex items-center bg-[#222222] rounded-md px-3 lg:py-2 w-full sm:w-1/2">
            <div className="flex items-center justify-center w-10 h-10 mr-3 rounded-full  select-none">
              <img src={logo2} alt="" className="w-full h-full object-contain" />
            </div>
            <input
              type="number"
              min={0}
              value={usdtAmount}
              onChange={(e) => setUsdtAmount(e.target.value)}
              placeholder="0"
              className="bg-transparent w-full text-right text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none"
              aria-label="Enter amount of USDT"
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
              className="bg-transparent w-full text-right text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none"
              aria-label="Enter amount in won"
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
              className={`text-xs sm:text-sm py-2 px-3 rounded select-none cursor-pointer transition 
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
            className="ml-auto bg-green-700 hover:bg-green-800 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded select-none cursor-pointer transition"
            title="정정"
          >
            {t("sellorder.clear")}
          </button>
        </div>

        {/* Buttons - fixed at bottom */}
        <div className="flex justify-center  bottom-0 gap-3 px-6 py-4 border-t border-gray-700 bg-[#181818] rounded-b-md">
          <button
            onClick={closeModal}
            className="bg-[#333333] cursor-pointer text-white px-6 py-2 rounded hover:bg-[#555555] transition"
            type="button"
          >
            {t("sellorder.cancel")}
          </button>
          <button
            onClick={submitOrder}
            type="button"
            className={`px-8 py-2 cursor-pointer rounded text-white transition ${"bg-[#037926] hover:bg-green-700"}`}
          >
            {loading ? <LoadingSpinner /> : `${t("sellorder.submit")}`}
          </button>
        </div>
      </div>
    </div>
  );
};
