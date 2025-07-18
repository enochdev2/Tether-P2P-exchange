import { CheckCircle, Clock, Star } from "lucide-react";
import logo2 from "../assets/Tether2.png";
import ConfirmModal from "./ConfirmModal";
import { FaCopy } from "react-icons/fa";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SuccessToast } from "../utils/Success";

// import your logo and statusColors accordingly

const AdminTradeCard2 = ({ offer, sell, approveOrders, rejectOrders }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApprove, setIsApprove] = useState(false)
  const [pendingOrderId, setPendingOrderId] = useState(null);

  const openCancelModal = (orderId, isAprove) => {
    if(isAprove){
      setIsApprove(true)
    }else{ 
      setIsApprove(false)

    }
    setPendingOrderId(orderId);
    setIsModalOpen(true);
  };

  // const handleMatchClick = () => {
  //   setIsMatchModalOpen(true);
  // };

  // const handleCloseModal = () => {
  //   setIsMatchModalOpen(false);
  // };

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
  const isPending = sell ? offer.status === "Pendin Approval" : offer.status === "Waiting for uy";

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
      className={`relative flex flex-col sm:flex-row items-center justify-between bg-red-50 border border-red-500 rounded-xl px-4 py-1 shadow-md transition-all duration-300 ${
        isPending ? "opacity-90 grayscale" : ""
      }`}
    >
      {/* Left Badge */}
      <div className="flex items-center gap-2 sm:w-24 justify-center sm:justify-start">
        <span className="bg-gray-700 text-white text-[13px] sm:text-sm md:text-base font-semibold px-3 py-1 rounded-lg shadow-sm">
          {t(`tradecard.${sell ? "sell" : "buy"}`)}
        </span>
        <span className="w-3 h-3 bg-gray-500 rounded-full hidden sm:block"></span>
      </div>

      {/* Nickname Display */}
      <div className="w-full sm:w-auto flex items-center justify-center sm:justify-start bg-slate-100 px-4 py-2 rounded-md font-medium text-sm sm:text-base text-gray-800 shadow-inner">
        {offer?.userId?.nickname || "Unnamed User"}
      </div>

      {/* Amount */}
      <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
        <img src={logo2} alt="Tether" className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="font-semibold">{t("tradecard.total", { amount: parseFloat(offer.amount).toFixed(4) })}</span>
      </div>

      {/* KRW Amount */}
      <div className="text-xs sm:text-sm md:text-base text-gray-700 font-medium text-center sm:text-left truncate w-full sm:w-40">
       {t("tradecard.krwPrice", {
            price: offer.krwAmount
              ? `₩${offer.krwAmount.toLocaleString()}`
              : `₩${offer.price.toLocaleString()}`,
          })}
      </div>

      {/* Approve / Reject Buttons */}
      {offer.status === "Pending Approval" && (
        <div className="flex gap-3 items-center">
          <button
            // onClick={() => approveOrders(offer._id)}
            onClick={() => openCancelModal(offer._id, true)}
            className="px-4 py-1.5 bg-[#26a17b] hover:bg-green-700 cursor-pointer text-white rounded-md text-sm shadow-md font-bold transition"
          >
             {t("tradecard.approve")}
          </button>
          <button
            onClick={() => openCancelModal(offer._id, false)}
            className="px-4 py-1.5 bg-[#a12626] hover:bg-red-700 text-white rounded-md text-sm shadow-md font-bold transition cursor-pointer"
          >
             {t("tradecard.reject")}
          </button>
        </div>
      )}

      {/* Order Info */}
      <div className="flex flex-col items-center sm:items-end text-xs sm:text-sm md:text-base text-gray-800 w-full sm:w-40 space-y-1 truncate">
        <div className="flex items-center space-x-2">
            <div className="break-words break-all text-center text-xs  sm:text-right w-full font-bold sm:w-auto">
             {sell
              ? `Sell${Math.floor(offer.amount)}-${offer._id.slice(16)}`
              : `Buy${Math.floor(offer.amount)}-${offer._id.slice(16)}`}
            </div>
            <button
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => handleCopy(offer._id)} // Handle copy when clicked
            >
              <FaCopy size={16} /> {/* Copy icon */}
            </button>
          </div>

        <div className="flex items-center justify-center sm:justify-end gap-2">
          <span
            className="w-3 h-3 rounded-full hidden sm:inline-block"
            style={{ backgroundColor: statusColors[offer.status] || "#ccc" }}
          />
          <span
            className={`font-semibold truncate max-w-[9rem] ${
              offer.status === "Pending Approval"
                ? "text-yellow-600"
                : offer.status === "Sell completed" || offer.status === "Buy Completed"
                ? "text-orange-500"
                : "text-green-600"
            }`}
          >
            {/* {offer.status} */}
            {offer.status === "Pending Approval" && t("status.pendingApproval")}
          </span>
        </div>

        <div className="text-center text-sm  sm:text-right text-gray-500">{dateOnly}</div>
      </div>
      <ConfirmModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => (isApprove ? approveOrders(pendingOrderId) : rejectOrders(pendingOrderId))}
        message={
          sell ? t("messages.areYouSureDeleteBuyOrder") : t("messages.areYouSureDeleteSellOrder")
        }
      />
    </div>
  );
};

export default AdminTradeCard2;
