import { CheckCircle, Clock, Star } from "lucide-react";
import logo2 from "../assets/Tether2.png";

const statusColors = {
  "On sell": "#26a17b", // Green
  "Pending Approval": "#a0a0a0", // Grey
  "Sell completed": "#f59e0b", // Amber
};

const TradeCard = ({ offer, sell }) => {
  const isPending = sell ? offer.status === " " : offer.status === " ";

  const timestamp = offer.createdAt;
  const dateObj = new Date(timestamp);

  const dateOnly = dateObj.toLocaleDateString("en-CA"); // YYYY-MM-DD

  return (
    <div
      className={`flex flex-col sm:flex-row items-center bg-white rounded-lg p-4 mb-4 border border-gray-200 shadow-sm
        ${isPending ? "opacity-90 filter grayscale" : ""}
      `}
    >
      {/* Left Section */}
      <div className="flex items-center w-full sm:w-24 mb-4 sm:mb-0 sm:mr-6 justify-center sm:justify-start">
        <div className="flex items-center space-x-2">
          <div className="bg-green-600 text-white font-semibold text-base sm:text-sm md:text-base px-4 py-2 rounded-md select-none whitespace-nowrap">
            {sell ? "Sell" : "Buy"}
          </div>
          <div className="w-3 h-3 bg-green-700 rounded-full mt-1" />
        </div>
      </div>

      {/* Center Left Section */}
      <div className="flex-1 w-full sm:w-auto flex items-center mb-4 sm:mb-0">
        <img src={logo2} alt="Tether logo" className="w-7 h-7 mr-3" />
        <span className="font-semibold text-lg sm:text-xl text-gray-900 truncate">
          {offer.amount} USDT
        </span>
      </div>

      {/* Center Right Section */}
      <div className="flex-1 w-full sm:w-auto font-semibold text-gray-900 text-base sm:text-lg mb-4 sm:mb-0 text-center sm:text-left truncate">
        {offer.krwAmount
          ? `₩${offer.krwAmount.toLocaleString()} KRW`
          : `₩${offer.price.toLocaleString()} KRW`}
      </div>

      {/* Right Section */}
      <div className="flex flex-col flex-1 w-full sm:w-32 items-center sm:items-end text-gray-800 text-sm space-y-1">
        <div className="break-words text-center sm:text-right w-full sm:w-auto truncate">
          {offer._id.slice(0, 10)}
        </div>
        <div className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
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
            {offer.status}
          </span>
        </div>
        <div className="text-center sm:text-right">{dateOnly}</div>
      </div>
    </div>
  );
};

export default TradeCard;
