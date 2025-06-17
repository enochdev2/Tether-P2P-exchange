import { CheckCircle, Clock, Star } from "lucide-react";
import logo2 from "../assets/Tether2.png";
import { Link, useNavigate } from "react-router-dom";
import { ErrorToast } from "../utils/Error";
import { SuccessToast } from "../utils/Success";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { FaCopy } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const statusColors = {
  "On sell": "#26a17b", // Green
  "Pending Approval": "#a0a0a0", // Grey
  "Sell completed": "#f59e0b", // Amber
};

const TradeCard = ({ offer, sell, fetchOrders }) => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  // const isPending = sell ? offer.status === " " : offer.status === " ";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState(null);

  const openCancelModal = (orderId) => {
    setPendingOrderId(orderId);
    setIsModalOpen(true);
  };

  // If this offer is "In Progress", don't render anything
  if (offer.status === "In Progress") return null;

  const handleCancleMatch = async (orderId) => {
    try {
      if (!orderId) return ErrorToast(" Order ID not found. Please try again.");
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("🚀 ~ handleCancleMatch ~ user:", user);
      console.log("🚀 ~ handleCancleMatch ~ user._id:", user._id);

      const url = sell
        ? `https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/sell-orders/${orderId}/cancel`
        : `https://tether-p2p-exchang-backend.onrender.com/api/v1/buy/buy-orders/${orderId}/cancel`;

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

  const timestamp = offer.createdAt;
  const dateObj = new Date(timestamp);

  const dateOnly = dateObj.toLocaleDateString("en-CA"); // YYYY-MM-DD

  const orderType = sell ? "sell" : "buy";

  return (
    <div
      className={`flex flex-co sm:flex-row items-center bg-white rounded-lg py-2 px-1 md:px-1 sm:py-2 md:py-2 mb-4 border border-gray-200 shadow-sm overflow-x-hidden justify-between
        ${offer.status === "Pending Approval" ? "border border-red-700" : ""}
      `}
    >
      {/* Left Section */}
      <div className="flex items-center sm:w-f sm:w-24 mb-4 sm:mb-0 sm:mr-6 justify-center sm:justify-start">
        <div className="flex items-center space-x-1 md:space-x-2">
          <div
            className={`bg-green-600 text-white font-semibold text-xs sm:text-sm md:text-base px-1 md:px-4 py-2 rounded-md select-none whitespace-nowrap ${
              offer.status === "Pending Approval" ? "filter grayscale" : ""
            } `}
          >
            {t(`tradecard.${sell ? "sell" : "buy"}`)}
          </div>
          <div className="w-3 h-3 hidden sm:block bg-green-700 rounded-full mt-1" />
        </div>
      </div>

      {/* center Section */}

      <div className="flex flex-1 flex-col sm:flex-row items-center justify-between w-full sm:w-auto  space-y-2 sm:space-y-0 sm:space-x-4">
        {/* Center Left Section */}
        <div className="flex-col md:flex-row md:flex-1 w-full sm:w-auto flex items-center mb-4 sm:mb-0">
          <img src={logo2} alt="Tether logo" className="w-5 h-5 md:w-7 md:h-7 mr-3" />
          <div className="flex flex-col">
            <span className="font-bold text-xs sm:text-base text-gray-400 truncate">
              {t("tradecard.total", { amount: parseFloat(offer.amount).toFixed(4) })}
            </span>
            <span className="font-semibold text-xs sm:text-base text-gray-900 truncate">
              {t("tradecard.balance", { amount: parseFloat(offer.amountRemaining).toFixed(4) })}{" "}
            </span>
          </div>
        </div>

        {/* Center Right Section */}
        <div className="flex-1 w-full md:ml-8 sm:w-auto font-semibold text-gray-900 text-xs sm:text-sm mb-4 sm:mb-0 text-center sm:text-left truncat">
          {t("tradecard.krwPrice", {
            price: offer.krwAmount
              ? `₩${offer.krwAmount.toLocaleString()}`
              : `₩${offer.price.toLocaleString()}`,
          })}
        </div>
      </div>

      {/* Right Section */}

      <div className="flex flex-col flex- sm:flex-row items-center justify-between w-full sm:w-auto">
        <div className="md:mr-10 sm:mr-5">
          {/* Cancel the order */}

          {/* Chat button for buy orders waiting for buy */}
          {offer.status !== "Pending Approval" && (
            <button
              // to={`chat/${offer._id}`}
              onClick={() => navigate(`/chats/${offer._id}/${orderType}`)}
              className="mt-2 px-1 md:px-3 py-2 cursor-pointer bg-[#26a17b] hover:bg-green-700 text-white rounded text-xs md:text-sm font-bold"
            >
              {t("tradecard.chat")}
            </button>
          )}
          {offer.status === "Pending Approval" && (
            <button
              onClick={() => openCancelModal(offer._id)}
              className="mt-2 px-2 md:px-3 py-2 cursor-pointer bg-[#dd2911] hover:bg-red-700 text-white rounded text-xs md:text-sm font-bold"
            >
              {t("tradecard.cancel")}
            </button>
          )}
        </div>

        {/* Right Section */}
        <div className="flex flex-col flex-wrap sm:flex-nowrap flex-1 w-full sm:w-32 items-center sm:items-end text-gray-800 text-xs space-y-1">
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
          <div className="flex items-center space-x-2">
            <div
              className="w-3 h-3 hidden sm:block rounded-full flex-shrink-0"
              style={{ backgroundColor: statusColors[offer.status] || "#ccc" }}
            />
            <span
              className={`font-semibold md:text-base select-none truncate max-w-[8rem] ${
                offer.status === "Pending Approval"
                  ? "text-gray-400"
                  : offer.status === "Sell completed" || offer.status === "Buy Completed"
                  ? "text-orange-500"
                  : "text-lime-600"
              }`}
            >
              {t(`tradecard.status.${offer.status.replace(" ", "").toLowerCase()}`, offer.status)}
            </span>
          </div>
          <div className="text-center sm:text-right">{dateOnly}</div>
        </div>
      </div>

      <ConfirmModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => handleCancleMatch(pendingOrderId)}
        message={t("tradecard.cancelConfirmMessage", {
          type: sell ? t("tradecard.sell") : t("tradecard.buy"),
        })}
      />
    </div>
  );
};

export default TradeCard;
