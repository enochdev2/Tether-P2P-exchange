import { CheckCircle, Clock, Star } from "lucide-react";
import logo2 from "../assets/Tether2.png";
import { Link, useNavigate } from "react-router-dom";

const statusColors = {
  "On sell": "#26a17b", // Green
  "Pending Approval": "#a0a0a0", // Grey
  "Sell completed": "#f59e0b", // Amber
};

const TradeCard = ({ offer, sell }) => {
  const navigate = useNavigate();
  const isPending = sell ? offer.status === " " : offer.status === " ";

  // If this offer is "In Progress", don't render anything
  if (offer.status === "In Progress") return null;

  const timestamp = offer.createdAt;
  const dateObj = new Date(timestamp);

  const dateOnly = dateObj.toLocaleDateString("en-CA"); // YYYY-MM-DD

   const orderType = sell ? "sell" : "buy";

  return (
    <div
      className={`flex flex-co sm:flex-row items-center bg-white rounded-lg py-2 px-2 sm:py-2 md:py-2 mb-4 border border-gray-200 shadow-sm
        ${offer.status === 'Pending Approval' ? "border border-red-700" : ""}
      `}
    >
      {/* Left Section */}
      <div className="flex items-center sm:w-f sm:w-24 mb-4 sm:mb-0 sm:mr-6 justify-center sm:justify-start">
        <div className="flex items-center space-x-1 md:space-x-2">
          <div className={`bg-green-600 text-white font-semibold text-xs sm:text-sm md:text-base px-1 md:px-4 py-2 rounded-md select-none whitespace-nowrap ${offer.status === 'Pending Approval' ? "filter grayscale" : ""} `}>
            {sell ? "Sell" : "Buy"}
          </div>
          <div className="w-3 h-3 hidden sm:block bg-green-700 rounded-full mt-1" />
        </div>
      </div>

      {/* Center Left Section */}
      <div className="flex-col md:flex-row md:flex-1 w-full sm:w-auto flex items-center mb-4 sm:mb-0">
        <img
          src={logo2}
          alt="Tether logo"
          className="w-5 h-5 md:w-7 md:h-7 mr-3"
        />
        <div className="flex flex-col">
          <span className="font-bold text-xs sm:text-base text-gray-400 truncate">
            Total: {parseFloat(offer.amount).toFixed(4)} USDT
          </span>
          <span className="font-semibold text-xs sm:text-base text-gray-900 truncate">
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

      <div>
        {/* Chat button for buy orders waiting for buy */}
        {offer.status !== "Pending Approval" && (
          <button
            // to={`chat/${offer._id}`}
            onClick={() => navigate(`/chats/${offer._id}/${orderType}`)}
            className="mt-2 px-3 py-2 cursor-pointer bg-[#26a17b] hover:bg-green-700 text-white rounded text-xs md:text-sm font-bold"
          >
            1:1 Chat
          </button>
        )}
      </div>

      {/* Right Section */}
      <div className="flex flex-col flex-wrap sm:flex-nowrap flex-1 w-full sm:w-32 items-center sm:items-end text-gray-800 text-xs space-y-1">
        <div className="break-words text-center sm:text-right w-full font-bold sm:w-auto truncate">
          {offer._id}
        </div>
        <div className="flex items-center space-x-2">
          <div
            className="w-3 h-3 hidden sm:block rounded-full flex-shrink-0"
            style={{ backgroundColor: statusColors[offer.status] || "#ccc" }}
          />
          <span
            className={`font-semibold md:text-base select-none truncate max-w-[8rem] ${
              offer.status === "Pending Approval"
                ? "text-gray-400"
                : offer.status === "Sell completed" ||
                  offer.status === "Buy Completed"
                ? "text-orange-500"
                : "text-lime-600"
            }`}
          >
            {offer.status}
          </span>
        </div>
        <div className="text-center sm:text-right">{dateOnly}</div>
      </div>
    </div>
  );
};

export default TradeCard;
