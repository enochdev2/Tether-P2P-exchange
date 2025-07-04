import { useTranslation } from "react-i18next";
import logo2 from "../assets/Tether2.png";

const statusColors = {
  "On sell": "#26a17b", // Green
  "Pending Approval": "#a0a0a0", // Grey
  "Sell completed": "#f59e0b", // Orange (amber)
};

const TradeCard2 = ({ offer }) => {
  const {t} = useTranslation();


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
   <div className="w-full">
  <div className="flex flex-col sm:flex-row flex-wrap sm:flex-nowrap items-start sm:items-center justify-between bg-white rounded-md p-3 mb-3 border border-gray-200 gap-4 sm:gap-0">
    
    {/* Left Section - Date & Time */}
    <div className="flex items-center gap-3 sm:w-auto w-full">
      <div className="text-gray-500 font-medium text-sm sm:text-base px-3 py-1 bg-gray-100 rounded">
        {dateOnly}
      </div>
      <div className="text-gray-700 font-semibold text-sm sm:text-base px-3 py-1 bg-gray-100 rounded">
        {timeOnly}
      </div>
    </div>

    {/* Action - Buying/Selling */}
    <div className="text-gray-900 font-semibold text-base sm:text-lg sm:w-auto w-full">
      {offer.action === "Buy" ? "Buying" : t("buytether.selling")}
    </div>

    {/* Amount and Status in One Row on All Screens */}
    <div className="flex items-center justify-between gap-3 sm:gap-4 flex-wrap sm:flex-nowrap w-full sm:w-auto">
      {/* Amount */}
      <div className="flex items-center gap-2 text-gray-900 font-medium text-sm sm:text-base">
        <img src={logo2} alt="usdt" className="w-5 h-5 sm:w-6 sm:h-6" />
        <span>{offer.amount} USDT</span>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 text-sm sm:text-base font-semibold">
        <div
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: statusColors[offer.status] || "#ccc",
          }}
        />
        <span
          className={`${
            offer.status === "Pending Approval"
              ? "text-gray-400"
              : offer.status === "Sell completed"
              ? "text-green-800"
              : "text-green-500"
          }`}
        >
          ({offer.status === "Sale Completed" && t("buytether.completedsale")}
          {offer.status === "Buy Completed" && t("buytether.completedbuy")})
        </span>
      </div>
    </div>
  </div>
</div>



  );
};

export default TradeCard2;
