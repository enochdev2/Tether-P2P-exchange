import { CheckCircle, Clock, Star } from "lucide-react";
import logo2 from "../assets/Tether2.png";
import LoadingSpiner from "./LoadingSpiner";

const statusColors = {
  "On sell": "#26a17b", // Green
  "Pending Approval": "#a0a0a0", // Grey
  "Sell completed": "#f59e0b", // Orange (amber)
};

const TradeCard2 = ({ offer }) => {
  // offer object expected to have:
  // action: "Sell"
  // usdtAmount: e.g. 503.56
  // krwAmount: e.g. 700000
  // status: e.g. "On sell", "Pending Approval", "Sell completed"
  // statusDate: e.g. "2025-05-20"

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
    <div>
     
        <div className="flex items-center justify-between bg-white rounded-md p-4 mb-3 border border-gray-200">
          {/* Left Section */}
          <div className="flex flex-1 lg:flex-2 items-center w-24 mr-6">
            <div className="flex flex-1">
              <div className="b text-gray-500 font-bold text-base lg:text-base px-3 py-1 rounded">
                {dateOnly}
              </div>
              <div className="b text-gray-600 font-bold text-base lg:text-lg px-3 py-1 rounded">
                {timeOnly}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="mt-2 font-semibold text-xl flex text-gray-900">
              {offer.action === "Buy" ? "Buying" : "Selling"}
            </div>
          </div>

          {/* Middle Section */}
          <div className="flex-1 md:flex-2 flex font-semibold text-base text-gray-900 items-center">
            <span className="mr-2">
              <img src={logo2} alt="" className="w-7 h-7" />
            </span>
            {offer.amount} USDT
          </div>

          {/* Right Section */}
          <div className="flex flex-1 md:flex-2 justify-end w-32">
            <div className="flex items-center space-x-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: statusColors[offer.status] || "#ccc",
                }}
              />
              <span
                className={`font-semibold sm:base lg:text-lg ${
                  offer.status === "Pending Approval"
                    ? "text-gray-400"
                    : offer.status === "Sell completed"
                    ? "text-green-800"
                    : "text-green-500"
                }`}
              >
                ( {offer.status})
              </span>
            </div>
          </div>
        </div>
    </div>
  );
};

export default TradeCard2;
