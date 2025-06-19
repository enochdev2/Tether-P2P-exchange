import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, Star } from "lucide-react";
import logo2 from "../assets/Tether2.png";
import { useState } from "react";
import { ErrorToast } from "../utils/Error";
import { SuccessToast } from "../utils/Success";
import ConfirmModal from "./ConfirmModal";
import { FaTrash, FaCopy } from "react-icons/fa";
import { useTranslation } from "react-i18next";

// import your logo and statusColors accordingly
 
const AdminTradeCard = ({ offer, sell, onMatch, fetchOrders }) => {
  const { t } = useTranslation(); 
  console.log("🚀 ~ AdminTradeCard ~ offer:", offer)
  const navigate = useNavigate();
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [buyerOrderId, setBuyerOrderId] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState(null);

  const openCancelModal = (orderId) => {
    setPendingOrderId(orderId);
    setIsModalOpen(true);
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

  // Adjust isPending logic if needed
  const isPending = sell ? offer.status === "Pending Approval" : offer.status === "Waiting for uy";

  const timestamp = offer.createdAt;
  const dateObj = new Date(timestamp);

  const dateOnly = dateObj.toLocaleDateString("en-CA"); // YYYY-MM-DD

  const handleCancleMatch = async (orderId) => {
    try {
      if (!orderId) return ErrorToast(" Order ID not found. Please try again.");
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("🚀 ~ handleCancleMatch ~ user:", user);
      console.log("🚀 ~ handleCancleMatch ~ user._id:", user._id);

      const url = sell
        ? `https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/admin/sell-orders/${orderId}/cancel`
        : `https://tether-p2p-exchang-backend.onrender.com/api/v1/buy/admin/buy-orders/${orderId}/cancel`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname: user.nickname }),
        // body: JSON.stringify({ orderId, nickname: user.nickname }),
      });
      const data = await response.json();

      if (!response.ok) {
        const data = await response.json();
        const errorMsg = data.error || data.message || "Failed to register user";
        ErrorToast(errorMsg);
      } else {
        await fetchOrders();
        const message = data.message || "Orders cancelled successfully!";
        SuccessToast(message);
      }
    } catch (error) {
      console.error("Error matching orders:", error);
    }
  };

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
             {t(`tradecard.${sell ? "sell" : "buy"}`)}
          </div>
          <div className="w-3 h-3 hidden sm:block bg-green-700 rounded-full mt-1" />
        </div>
      </div>

      {/* Nickname */}
      <div className="sm:mr-4 font-semibold w-full sm:w-auto bg-slate-100 px-4 py-2 rounded-lg flex items-center text-gray-700 text-sm shadow-inner">
        {sell ? offer?.sellerNickname : offer.buyerNickname}
      </div>

      {/* Center Left Section */}
      <div className="flex flex-col md:flex-row space-x-3 md:flex-1 w-full sm:w-auto items-center mb-4 sm:mb-0">
        <div className="flex items-center">
          <img src={logo2} alt="Tether logo" className="w-6 h-6 md:w-7 md:h-7 mr-3" />
          <div className="flex flex-col space-y-1 text-sm text-gray-800">
            <span className="font-medium">{t("tradecard.total", { amount: parseFloat(offer.amount).toFixed(4) })}</span>
            <span className="font-medium">
              {t("tradecard.balance", { amount: parseFloat(offer.amountRemaining).toFixed(4) })}
            </span>
          </div>
        </div>
      </div>
      <div className="font-semibold text-sm text-gray-700 flex-1">
        {t("tradecard.krwPrice", {
            price: offer.krwAmount
              ? `₩${offer.krwAmount.toLocaleString()}`
              : `₩${offer.price.toLocaleString()}`,
          })}
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-center space-x-3 my-2 sm:my-0">
        {/* <button
          onClick={() => navigate(`/chats/${orderType}/${offerId}`)}
          className="px-4 py-2 bg-[#26a17b] hover:bg-green-700 text-white rounded-md text-sm font-semibold shadow"
        >
         {t("tradecard.chat")}
        </button> */}

        <button
          onClick={() => openCancelModal(offer._id)}
          className="px-4 py-2 text-red-600 hover:bg-gray-400 rounded-md bg-gray-200 border border-red-300 shadow-sm cursor-pointer"
        >
          <FaTrash size={14} />
        </button>

        {sell && (
          <button
            onClick={handleMatchClick}
            className="px-4 py-2 bg-[#26a17b] cursor-pointer hover:bg-green-700 text-white rounded-md text-sm font-semibold shadow"
          >
            {t("tradecard.match")}
          </button>
        )}
      </div>

      {/* Right Section */}
      <div className="flex flex-col flex-wrap sm:flex-nowrap ml-10 lg:ml-20 w-full sm:w-32 items-center sm:items-end text-gray-800 text-xs space-y-1 relative mt-3 sm:mt-0">
        <div className="flex items-center space-x-2">
            <div className="break-words break-all text-center text-xs  sm:text-right w-full font-bold sm:w-auto">
              {offer._id}
            </div>
            <button
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => handleCopy(offer._id)} // Handle copy when clicked
            >
              <FaCopy size={16} /> {/* Copy icon */}
            </button>
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
                : offer.status === "Sell completed" || offer.status === "Buy Completed"
                ? "text-orange-500"
                : "text-green-600"
            }`}
          >
           {t(`tradecard.status.${offer.status.replace(" ", "").toLowerCase()}`, offer.status)}
          
          </span>
        </div>
        <div className="text-center sm:text-right text-gray-500 text-sm">{dateOnly}</div>
      </div>
      <ConfirmModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => handleCancleMatch(pendingOrderId)}
        message="Are you sure you want to delete your buy Order?"
      />

      {/* Modal */}
      {isMatchModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl border-green-700 border-2 shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Match Seller with Buyer</h3>
            <input
              type="text"
              className="border border-gray-300 rounded-md p-2 mb-4 w-full focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter Buyer Order ID"
              value={buyerOrderId}
              onChange={(e) => setBuyerOrderId(e.target.value)}
            />
            <div className=" w-full flex justify-between space-x-3">
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
