import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, Star } from "lucide-react";
import logo2 from "../assets/Tether2.png";
import { useState } from "react";

const statusColors = {
  "On sell": "#26a17b", // Green
  "Pending Approval": "#a0a0a0", // Grey
  "Sell completed": "#f59e0b", // Amber
};

// import your logo and statusColors accordingly

const AdminTradeCard = ({ offer, sell, onMatch }) => {
  const navigate = useNavigate();
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [buyerOrderId, setBuyerOrderId] = useState("");

  // Adjust isPending logic if needed
  const isPending = sell
    ? offer.status === "Pending Approval"
    : offer.status === "Waiting for uy";

  const timestamp = offer.createdAt;
  const dateObj = new Date(timestamp);

  const dateOnly = dateObj.toLocaleDateString("en-CA"); // YYYY-MM-DD

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

  const orderType = sell ? "sell" : "buy";
  const offerId = offer._id;

  // Status colors example (define your actual statusColors object elsewhere)
  // const statusColors = {
  //   "Pending Approval": "#ccc",
  //   "Waiting for Buy": "#fbbf24", // amber for example
  //   "Sell completed": "#f97316",
  //   "Buy Completed": "#f97316",
  //   "On Sale": "#22c55e",
  //   // add your others...
  // };

  const statusColors = {
    "On sell": "#26a17b", // Green
    "Pending Approval": "#a0a0a0", // Grey
    "Sell completed": "#f59e0b", // Amber
  };

  return (
    <div
      className={`relative flex flex-col sm:flex-row items-center bg-white rounded-lg py-3 px-4 mb-4 border border-gray-300 shadow-md ${
        isPending ? "opacity-90 grayscale" : ""
      }`}
    >
      {/* Left Section */}
      <div className="flex items-center sm:w-24 mb-4 sm:mb-0 sm:mr-2 justify-center sm:justify-start">
        <div className="flex items-center space-x-2">
          <div className="bg-green-600 text-white font-semibold text-sm px-4 py-1.5 rounded-md select-none whitespace-nowrap shadow">
            {sell ? "Sell" : "Buy"}
          </div>
          <div className="w-3 h-3 hidden sm:block bg-green-700 rounded-full mt-1" />
        </div>
      </div>

      {/* Nickname */}
      <div className="sm:mr-4 font-semibold w-full sm:w-auto bg-slate-100 px-4 py-2 rounded-lg flex items-center text-gray-700 text-sm shadow-inner">
        {offer?.userId?.nickname || "nickname"}
      </div>

      {/* Center Left Section */}
      <div className="flex flex-col md:flex-row space-x-3 md:flex-1 w-full sm:w-auto items-center mb-4 sm:mb-0">
        <div className="flex items-center">
          <img
            src={logo2}
            alt="Tether logo"
            className="w-6 h-6 md:w-7 md:h-7 mr-3"
          />
          <div className="flex flex-col space-y-1 text-sm text-gray-800">
            <span className="font-medium">Total: {offer.amount} USDT</span>
            <span className="font-medium">
              Bal: {parseFloat(offer.amountRemaining).toFixed(4)} USDT
            </span>
          </div>
        </div>
      </div>
      <div className="font-semibold text-sm text-gray-700 flex-1">
        {offer.krwAmount
          ? `₩${offer.krwAmount.toLocaleString()} KRW`
          : `₩${offer.price.toLocaleString()} KRW`}
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-center space-x-3 my-2 sm:my-0">
        <button
          onClick={() => navigate(`/chats/${orderType}/${offerId}`)}
          className="px-4 py-2 bg-[#26a17b] hover:bg-green-700 text-white rounded-md text-sm font-semibold shadow"
        >
          1:1 Chat
        </button>

        {sell && (
          <button
            onClick={handleMatchClick}
            className="px-4 py-2 bg-[#26a17b] hover:bg-green-700 text-white rounded-md text-sm font-semibold shadow"
          >
            Match
          </button>
        )}
      </div>

      {/* Right Section */}
      <div className="flex flex-col flex-wrap sm:flex-nowrap ml-10 lg:ml-20 w-full sm:w-32 items-center sm:items-end text-gray-800 text-xs space-y-1 relative mt-3 sm:mt-0">
        <div className="break-words text-center sm:text-right w-full sm:w-auto truncate text-gray-500 font-mono">
          {offer._id}
        </div>
        <div className="flex items-center text-sm space-x-2">
          <div
            className="w-3 h-3 hidden sm:block rounded-full flex-shrink-0"
            style={{ backgroundColor: statusColors[offer.status] || "#ccc" }}
          />
          <span
            className={`font-semibold truncate max-w-[8rem] ${
              offer.status === "Pending Approval"
                ? "text-yellow-600"
                : offer.status === "Sell completed" ||
                  offer.status === "Buy Completed"
                ? "text-orange-500"
                : "text-green-600"
            }`}
          >
            {offer.status}
          </span>
        </div>
        <div className="text-center sm:text-right text-gray-500 text-sm">
          {dateOnly}
        </div>
      </div>

      {/* Modal */}
      {isMatchModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl border-green-700 border-2 shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Match Seller with Buyer
            </h3>
            <input
              type="text"
              className="border border-gray-300 rounded-md p-2 mb-4 w-full focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter Buyer Order ID"
              value={buyerOrderId}
              onChange={(e) => setBuyerOrderId(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-gray-800"
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

export default AdminTradeCard;
