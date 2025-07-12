import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, Star } from "lucide-react";
import logo2 from "../../assets/Tether2.png";
import { useState } from "react";
import { FaCopy } from "react-icons/fa";
import { SuccessToast } from "../../utils/Success";
import { useTranslation } from "react-i18next";

// import your logo and statusColors accordingly

const UserTradeInProgressCard = ({ offer, sell }) => {
   const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [buyerOrderId, setBuyerOrderId] = useState("");

  // Adjust isPending logic if needed
  const isPending = offer.status === "In Progress";

  const timestamp = offer.createdAt;
  const dateObj = new Date(timestamp);

  const dateOnly = dateObj.toLocaleDateString("en-CA"); // YYYY-MM-DD

  const handleMatchClick = () => {
    setIsMatchModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsMatchModalOpen(false);
  };

  const handleCopy = (id) => {
    navigator.clipboard
      .writeText(id)
      .then(() => {
        // Optionally, you can show a success message or change the icon state
        SuccessToast("ID copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const statusColors = {
    "On sell": "#26a17b", // Green
    "Pending Approval": "#a0a0a0", // Grey
    "Sell completed": "#f59e0b", // Amber
  };

  const orderType = sell ? "sell" : "buy";

  return (
    <div
      className={`relative flex flex-col sm:flex-row items-center bg-green-100 rounded-lg py-2 px-2 sm:py-3 md:py-2 mb-4 border border-green-900 shadow-sm
        
      `}
    >
      {/* ${isPending ? "opacity-90 filter grayscale" : ""} */}

      {/* Left Section */}
      <div className="flex flex-2 items-center sm:w-f sm:w-24 mb-4 sm:mb-0 sm:mr-6 justify-center sm:justify-start">
        <div className="flex items-center space-x-1 md:space-x-2 ">
          <div className="bg-green-600 text-white font-semibold text-xs sm:text-sm md:text-base px-1 md:px-4 py-2 rounded-md select-none whitespace-nowrap">
            {t("buytether.myOrdersInProgress")}
          </div>
        </div>
      </div>

      {/* Center Left Section */}
      <div className="flex-col md:flex-row md:flex-2 w-full sm:w-auto flex items-center mb-4 sm:mb-0">
        <img src={logo2} alt="Tether logo" className="w-5 h-5 md:w-7 md:h-7 mr-3" />
        <div className="flex flex-col space-y-2">
          <span className="font-medium text-xs sm:text-[16px] text-gray-400 truncate">
            Total: {offer.amount} USDT
          </span>
          <span className="font-medium text-xs sm:text-[16px] text-gray-900 truncate">
            Bal: {parseFloat(offer.amountRemaining).toFixed(4)} USDT
          </span>
        </div>
      </div>

      {/* Center Right Section */}
      <div className="flex-1 w-full sm:w-auto font-semibold text-gray-900 text-xs sm:text-base mb-4 sm:mb-0 text-center sm:text-left truncat">
        {offer.krwAmount
          ? `₩${offer.krwAmount.toLocaleString()} KRW`
          : `₩${offer.price.toLocaleString()} KRW`}
      </div>

      {offer.status === "In Progress" && (
        <div className="flex flex-wrap space-x-5 space-y-3 items-center">
          <div className="space-x-3">
            {/* Chat button for buy orders waiting for buy */}
            <button
              onClick={() => navigate(`/chats/${offer._id}/${orderType}`)}
              className="mt-2 px-3 py-2 cursor-pointer bg-[#26a17b] hover:bg-green-700 text-white rounded text-xs md:text-sm font-bold"
            >
              1:1 Chat
            </button>
          </div>
        </div>
      )}

      {/* Right Section */}
      <div className="flex flex-col flex-wrap sm:flex-nowrap md:flex-2 w-full sm:w-32 items-center sm:items-end text-gray-800 text-xs space-y-1 relative">
        <div className="flex items-center space-x-2">
          <div className="break-words break-all text-center text-xs  sm:text-right w-full font-bold sm:w-auto">
            {sell
              ? `Sell${Math.floor(offer.amount)}-${offer._id.slice(16)}`
              : `Buy${Math.floor(offer.amount)}-${offer._id.slice(16)}`}
          </div>
          <button
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={() => handleCopy(offer._id)} // Handle copy when clicked
          >
            <FaCopy size={16} /> 
          </button>
        </div>
        <div className="flex items-center  md:text-[16px] space-x-2">
          <div
            className="w-3 h-3 hidden sm:block rounded-full flex-shrink-0"
            style={{ backgroundColor: statusColors[offer.status] || "#ccc" }}
          />
          <span
            className={`font-semibold select-none truncate max-w-[8rem] ${
              offer.status === "Pending Approval"
                ? "text-gray-400"
                : offer.status === "Sell completed" || offer.status === "Buy Completed"
                ? "text-orange-500"
                : "text-lime-600"
            }`}
          >
            {offer.status === "In Progress" && t("status.inProgress")}
            {/* {offer.status} */}
          </span>
        </div>
        <div className="text-center sm:text-right">{dateOnly}</div>
      </div>
      {/* Modal for Matching */}
      {isMatchModalOpen && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg border-green-700 border-2 shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Match Seller with Buyer</h3>
            <input
              type="text"
              className="border border-gray-300 rounded-md p-2 mb-4 w-full"
              placeholder="Enter Buyer Order ID"
              value={buyerOrderId}
              onChange={(e) => setBuyerOrderId(e.target.value)}
            />
            <div className="flex justify-between">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleMatchSubmit}
                className="px-4 py-2 bg-[#26a17b] hover:bg-green-700 text-white rounded-md"
              >
                Match
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTradeInProgressCard;
