import { CheckCircle, Clock, Star } from "lucide-react";
import logo2 from "../assets/Tether2.png";

const statusColors = {
  "On sell": "#26a17b", // Green
  "Pending Approval": "#a0a0a0", // Grey
  "Sell completed": "#f59e0b", // Orange (amber)
};

const TradeCard = ({ offer }) => {
  // offer object expected to have:
  // action: "Sell"
  // usdtAmount: e.g. 503.56
  // krwAmount: e.g. 700000
  // status: e.g. "On sell", "Pending Approval", "Sell completed"
  // statusDate: e.g. "2025-05-20"

  return (
    <div className="flex items-center justify-between bg-white rounded-md p-4 mb-3 border border-gray-200">
      {/* Left Section */}
      <div className="flex flex-col items-center w-24 mr-6">
        <div className="">
          <div className="bg-green-600 text-white font-bold text-lg px-3 py-1 rounded">
            {offer.action}
          </div>
          <div className="w-2 h-2 mx-auto bg-green-600 rounded-full mt-1"></div>
        </div>
      </div>

      <div className="flex-1">
        <div className="mt-2 font-semibold text-xl flex text-gray-900">
          {" "}
          <span className="mr-2">
            <img src={logo2} alt="" className="w-7 h-7" />
          </span>
          {offer.usdtAmount} USDT
        </div>
      </div>

      {/* Middle Section */}
      <div className="flex-1 font-semibold text-lg text-gray-900">
        ₩{offer.krwAmount.toLocaleString()} KRW
      </div>

      {/* Right Section */}
      <div className="flex flex-col items-end w-32">
        <div className="text-sm text-gray-700">
          {offer.ordernumber}
        </div>
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
                : "text-green-600"
            }`}
          >
            {offer.status}
          </span>
        </div>
        <div className="text-sm text-gray-400 mt-1">{offer.statusDate}</div>
      </div>
    </div>
  );
};

export default TradeCard;
