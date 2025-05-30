import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, Star } from "lucide-react";
import logo2 from "../assets/Tether2.png";

const statusColors = {
  "On sell": "#26a17b", // Green
  "Pending Approval": "#a0a0a0", // Grey
  "Sell completed": "#f59e0b", // Amber
};

// import your logo and statusColors accordingly

const AdminTradeCard2 = ({ offer, sell, approveOrders, rejectOrders, onMatch }) => {
  const navigate = useNavigate();

  const handleMatchClick = () => {
    setIsMatchModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsMatchModalOpen(false);
  };

  const handleMatchSubmit = () => {
    onMatch(buyerOrderId, offer._id); // Trigger matching in the parent component
    setIsMatchModalOpen(false); // Close the modal
    setBuyerOrderId(""); // Reset the input field
  };

  // Adjust isPending logic if needed
  const isPending = sell
    ? offer.status === "Pendin Approval"
    : offer.status === "Waiting for uy";

  

  const timestamp = offer.createdAt;
  const dateObj = new Date(timestamp);

  const dateOnly = dateObj.toLocaleDateString("en-CA"); // YYYY-MM-DD

  const statusColors = {
    "On sell": "#26a17b", // Green
    "Pending Approval": "#a0a0a0", // Grey
    "Sell completed": "#f59e0b", // Amber
  };

  return (
    <div
      className={`relative flex flex-col sm:flex-row items-center bg-white rounded-lg py-2 px-2 sm:py-3 md:py-1 mb-4 border border-gray-200 shadow-sm
        ${isPending ? "opacity-90 filter grayscale" : ""}
      `}
    >
      {/* Left Section */}
      <div className="flex items-center sm:w-f sm:w-24 mb-4 sm:mb-0 sm:mr-6 justify-center sm:justify-start">
        <div className="flex items-center space-x-1 md:space-x-2">
          <div className="bg-gray-400 text-white font-semibold text-xs sm:text-sm md:text-base px-1 md:px-4 py-2 rounded-md select-none whitespace-nowrap">
            {sell ? "Sell" : "Buy"}
          </div>
          <div className="w-3 h-3 hidden sm:block bg-gray-400 rounded-full mt-1" />
        </div>
      </div>

      {/* Center Left Section */}
      <div className="flex-col md:flex-row md:flex-1 w-full sm:w-auto flex items-center mb-4 sm:mb-0">
        <img
          src={logo2}
          alt="Tether logo"
          className="w-5 h-5 md:w-7 md:h-7 mr-3"
        />
        <span className="font-medium text-xs sm:text-[16px] text-gray-400 truncate">
          {offer.amount} USDT
        </span>
      </div>

      {/* Center Right Section */}
      <div className="flex-1 w-full sm:w-auto font-semibold text-gray-400 text-xs sm:text-[16px] mb-4 sm:mb-0 text-center sm:text-left truncat">
        {offer.krwAmount
          ? `₩${offer.krwAmount.toLocaleString()} KRW`
          : `₩${offer.price.toLocaleString()} KRW`}
      </div>

      <div>
        {/* Chat button for buy orders waiting for buy */}
        {offer.status === "Pending Approval" && (
          <div className=" space-x-3">
            <button
              onClick={() => approveOrders(offer._id)}
              className="mt-2 px-2 py-2 cursor-pointer bg-[#26a17b] hover:bg-green-700 text-white rounded text-xs md:text-base font-bold"
            >
              Approve
            </button>
            <button
              onClick={() => rejectOrders(offer._id)}
              className="mt-2 px-2 py-2 cursor-pointer bg-[#a12626] hover:bg-red-700 text-white rounded text-xs md:text-base font-bold"
            >
              Reject
            </button>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex flex-col flex-wrap sm:flex-nowrap flex-1 w-full sm:w-32 items-center sm:items-end text-gray-800 text-xs space-y-1 relative">
        <div className="break-words text-center sm:text-right w-full sm:w-auto truncate">
          {offer._id.slice(0, 10)}
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

export default AdminTradeCard2;
