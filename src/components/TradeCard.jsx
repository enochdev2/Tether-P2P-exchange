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

  // Get date only (e.g. "2025-05-22")
  const dateOnly = dateObj.toLocaleDateString("en-CA"); // ISO-like format YYYY-MM-DD

  // Get time only (e.g. "02:38:31" or "2:38 AM")
  const timeOnly = dateObj.toLocaleTimeString("en-US", {
    hour12: false, // false for 24-hour, true for AM/PM
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div
      className={`flex items-center justify-between bg-white rounded-md p-4 mb-3 border border-gray-200
        ${isPending ? "opacity-90 filter grayscale" : ""}
      `}
    >
      {/* Left Section */}
      <div className="flex  flex-col items-center w-24 mr-6">
        <div className="flex justify-between items-center space-x-2">
          <div className="bg-green-500/80 text-white font-bold text-lg px-3 py-1 rounded">
            {sell ? "Sell" : "Buy"}
          </div>
          <div className="w-2 h-2 mx-auto bg-green-600/80 rounded-full mt-1"></div>
        </div>
      </div>

      <div className="flex-1">
        <div className="mt-2 font-semibold text-xl flex text-gray-900">
          {" "}
          <span className="mr-2">
            <img src={logo2} alt="" className="w-7 h-7" />
          </span>
          {offer.amount} USDT
        </div>
      </div>

      {/* Middle Section */}
      <div className="flex-1 font-semibold text-lg text-gray-900">
        {offer.krwAmount
          ? `₩${offer.krwAmount.toLocaleString()} KRW`
          : `₩${offer.price.toLocaleString()} KRW`}
      </div>

      {/* Right Section */}
      <div className="flex flex-col flex-1 items-end w-32">
        <div className="text-sm text-gray-800">{offer._id.slice(0, 10)}</div>
        <div className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: statusColors[offer.status] || "#ccc" }}
          />
          <span
            className={`font-semibold ${
              offer.status === "Pending Approval"
                ? "text-gray-400"
                : offer.status === "Sell completed"
                ? "text-orange-500"
                : offer.status === "Buy Completed"
                ? "text-orange-500"
                : "text-lime-600"
            }`}
          >
            {offer.status}
          </span>
        </div>
        <div className="text-sm text-gray-800 mt-1">{dateOnly}</div>
      </div>
    </div>
  );
};

export default TradeCard;
