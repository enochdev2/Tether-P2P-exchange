import { CheckCircle, Clock, Star } from "lucide-react";
import logo2 from "../assets/Tether2.png";

const statusColors = {
  "On sell": "#26a17b", // Green
  "Pending Approval": "#a0a0a0", // Grey
  "Sell completed": "#f59e0b", // Amber
};

const TradeCard = ({ offer }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto sm:max-w-full 
          flex flex-col items-center text-center
          lg:flex-row lg:items-center lg:justify-between lg:text-left border border-gray-200 hover:shadow-lg transition-shadow duration-300"
    >
      {/* Left: Action and Status */}
      <div className="flex flex-col items-center mb-5 sm:mb-0 sm:min-w-[150px] lg:items-start">
        <div
          className="text-white font-semibold px-5 py-2 rounded-full tracking-wide text-center text-sm sm:text-base"
          style={{ backgroundColor: statusColors[offer.status] || "#888" }}
        >
          {offer.status}
        </div>
        {/* <div
          className="hidden sm:block w-1 h-1 rounded-full mt-3"
          style={{ backgroundColor: statusColors[offer.status] || "#888" }}
        ></div> */}
        {/* Right bottom date (desktop) */}
        <div className="hidden lg:block text-gray-400 text-sm italic mt-3">
          Updated{" "}
          {new Date(offer.statusDate).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Middle: Amounts */}
      <div className="flex-1 flex flex-col items-center space-y-3 sm:flex-row sm:items-center sm:justify-center sm:space-y-0 sm:space-x-12">
        <div className="flex items-center space-x-3 text-gray-900 font-bold text-2xl">
          <img src={logo2} alt="USDT" className="w-8 h-8" />
          <span>{Number(offer.usdtAmount).toFixed(2)} USDT</span>
        </div>
        <div className="text-gray-700 font-semibold text-xl sm:text-2xl">
          ₩{Number(offer.krwAmount).toLocaleString()} KRW
        </div>
      </div>

      {/* Right: Action */}
      <div className="mt-5 sm:mt-0 sm:min-w-[100px] flex justify-center sm:justify-end">
        <div className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold tracking-wide cursor-default select-none shadow-sm">
          {offer.action}
        </div>
      </div>

      {/* Bottom date (mobile only) */}
      <div className="sm:hidden mt-4 text-center text-gray-400 text-xs italic">
        Updated:{" "}
        {new Date(offer.statusDate).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </div>
    </div>
  );
};

export default TradeCard;
