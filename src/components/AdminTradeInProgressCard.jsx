import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, Star } from "lucide-react";
import { FaChevronDown, FaChevronUp, FaTrash, FaCopy } from "react-icons/fa";
import logo2 from "../assets/Tether2.png";
import { useState } from "react";
import { ErrorToast } from "../utils/Error";
import { SuccessToast } from "../utils/Success";
import ConfirmModal from "./ConfirmModal";
import { useTranslation } from "react-i18next";
import ConfirmModal3 from "./ConfirmModal3";

// import your logo and statusColors accordingly

const AdminTradeInProgressCard = ({ offer, sell, onMatch, onCancel, onMatchs, fetchOrders }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [buyerOrderId, setBuyerOrderId] = useState("");

  // Adjust isPending logic if needed
  const isPending = offer.status === "In Progress";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpens, setIsModalOpens] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState(offer?.sellerNickname || null);

  const openCancelModal = (orderId) => {
    setPendingOrderId(orderId);
    setIsModalOpen(true);
  };
  const openCancelModals = (orderId, isCancels) => {
    setIsCancel(isCancels);
    setPendingOrderId(orderId);
    setIsModalOpens(true);
  };

  const timestamp = offer.createdAt;
  const dateObj = new Date(timestamp);

  const dateOnly = dateObj.toLocaleDateString("en-CA"); // YYYY-MM-DD

  const handleMatchClick = () => {
    setIsMatchModalOpen(true);
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

  const handleCancleMatch = async (orderId) => {
    try {
      if (!orderId) return ErrorToast(" Order ID not found. Please try again.");
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      const url = sell
        ? `https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/admin/sell-orders/${orderId}/cancel`
        : `https://tether-p2p-exchang-backend.onrender.com/api/v1/buy/admin/buy-orders/${orderId}/cancel`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname: offer?.sellerNickname }),
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

  const handleCloseModal = () => {
    setIsMatchModalOpen(false);
  };

  // const handleMatchSubmit = () => {
  //   onMatchs(offer.currentBuyOrderInProgress, offer._id); // Trigger matching in the parent component
  //   setIsMatchModalOpen(false); // Close the modal
  //   setBuyerOrderId(""); // Reset the input field
  // };

  const handleMatchSubmit = () => {
    onMatchs(buyerOrderId, offer._id); // Trigger matching in the parent component
    setIsMatchModalOpen(false); // Close the modal
    setBuyerOrderId(""); // Reset the input field
  };

  const handleMatchComplete = () => {
    onMatch(offer.currentBuyOrderInProgress, pendingOrderId); // Trigger matching in the parent component
    setIsMatchModalOpen(false); // Close the modal
    setBuyerOrderId(""); // Reset the input field
  };

  const handleMatchCancel = () => {
    const currentOrderInProgress = sell
      ? offer.currentBuyOrderInProgress
      : offer.currentSellOrderInProgress;
    onCancel(currentOrderInProgress, pendingOrderId); // Trigger matching in the parent component
    setIsMatchModalOpen(false); // Close the modal
    setBuyerOrderId(""); // Reset the input field
  };

  const orderType = sell ? "sell" : "buy";
  const buyOrderId = sell ? offer.currentBuyOrderInProgress : offer.currentSellOrderInProgress;

  const Links = sell
    ? `/chat/${offer._id}/${buyOrderId}/${orderType}`
    : `/chat/${offer._id}/${buyOrderId}/${orderType}`;

  const buildMatchedTableRows = (offer, sell) => {
    const matchedOrders = sell ? offer.matchedBuyOrders : offer.matchedSellOrders;

    const rows = [];

    matchedOrders?.forEach((match, index) => {
      const matchAmount = match.amount;
      // const buyerName = match.buyerNickname || "Buyer";
      const buyerName = match.orderId?.buyerNickname || "Buyer";
      const sellerName = offer.userId?.nickname || "Seller";

      rows.push({
        type: `Sell ${index + 1}`,
        amount: `${matchAmount} USDT`,
        user: sellerName,
      });

      rows.push({
        type: `Buy ${index + 1}`,
        amount: `${matchAmount} USDT`,
        user: buyerName,
      });
    });

    return rows;
  };

  const matchedOrders = sell ? offer?.matchedBuyOrders : offer?.matchedSellOrders;

  return (
    <div className="relative  w-full flex flex-col gap-4 items-center mb-4 rounded-xl bg-white p-2 shadow-lg border border-green-600">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start  sm:items-center justify-between w-full gap-4">
        {/* Status & Nickname */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="bg-green-600 text-white text-sm font-semibold px-3 py-2 rounded-md shadow-sm">
            {t("tradecard.matchInProgress")}
          </span>
          <button
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-md font-medium px-3 py-1 rounded-md transition"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {offer?.userId?.nickname || "Nickname"}
          </button>
        </div>

        {/* Amount & Balance */}
        <div className="flex items-center gap-2 text-md text-gray-700">
          <img src={logo2} alt="Tether" className="w-5 h-5" />
          <div className="leading-tight">
            <p className="text-gray-400 text-sm">
              {t("tradecard.total", { amount: parseFloat(offer.amount).toFixed(4) })}
            </p>
            <p className="font-semibold text-md">
              {t("tradecard.balance", { amount: parseFloat(offer.amountRemaining).toFixed(4) })}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-[#26a17b] hover:bg-green-700 text-white p-2 cursor-pointer rounded-md shadow-sm"
          >
            {isDropdownOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </button>

          {sell &&
            (offer.status === "In Progress" ? (
              <div className="space-x-3">
                <button
                  onClick={() => navigate(Links)}
                  className="bg-[#26a17b] hover:bg-green-700 cursor-pointer text-white text-sm px-3 py-2 rounded-md font-medium shadow-sm "
                >
                  {t("tradecard.chat")}
                </button>
                <button
                  onClick={() => openCancelModals(offer._id, true)}
                  className="bg-red-600  cursor-pointer hover:bg-red-700 text-white text-sm px-3 py-2 rounded-md font-medium shadow-sm"
                >
                  {t("tradecard.cancel")}
                </button>
                <button
                  // onClick={handleMatchComplete}
                  onClick={() => openCancelModals(offer._id, false)}
                  className="bg-cyan-600  hover:bg-cyan-700 text-white  text-xs px-2 py-3 rounded-md font-medium cursor-pointer shadow-sm"
                >
                  {t("tradecard.completematch")}
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={handleMatchClick}
                  className="bg-cyan-600  hover:bg-cyan-600 text-white text-xs px-3 py-3 rounded-md font-semibold shadow-sm cursor-pointer"
                >
                  {t("tradecard.match")}
                </button>
                <button
                  onClick={() => openCancelModal(offer._id)}
                  className="px-4 py-2 text-red-600 hover:bg-gray-400 rounded-md bg-gray-200 border border-red-300 shadow-sm cursor-pointer"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
          {!sell &&
            (offer.status === "In Progress" ? (
              <div className="space-x-3">
                <button
                  onClick={() => navigate(`/chat/${offer._id}/${buyOrderId}/${orderType}`)}
                  className="bg-[#26a17b] hover:bg-green-700 cursor-pointer text-white text-sm px-3 py-2 rounded-md font-medium shadow-sm "
                >
                  {t("tradecard.chat")}
                </button>

                <button
                  onClick={() => openCancelModals(offer._id, true)}
                  // onClick={handleMatchCancel}
                  className="bg-red-600  cursor-pointer hover:bg-red-700 text-white text-sm px-3 py-2 rounded-md font-medium shadow-sm"
                >
                  {t("tradecard.cancel")}
                </button>
              </div>
            ) : (
              <button
                onClick={() => openCancelModal(offer._id)}
                className="px-4 py-2 text-red-600 hover:bg-gray-400 rounded-md bg-gray-200 border border-red-300 shadow-sm cursor-pointer"
              >
                <FaTrash size={14} />
              </button>
            ))}
        </div>

        {/* ID, Status, Date */}
        <div className="text-xs text-gray-600 text-right space-y-0.5 leading-snug">
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
          <p className="font-bold text-green-700">{offer.status}</p>
          <p className="text-gray-500">{dateOnly}</p>
        </div>
      </div>

      <ConfirmModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => handleCancleMatch(pendingOrderId)}
        message="Are you sure you want to delete the buy Order?"
      />
      <ConfirmModal3
        open={isModalOpens}
        onClose={() => setIsModalOpens(false)}
        onConfirm={isCancel ? handleMatchCancel : handleMatchComplete}
        message="Are you sure you want to delete the buy Order?"
      />

      {/* Dropdown Table */}
      {isDropdownOpen && (
        <div className="w-full mt-3 bg-white border border-gray-200 rounded-lg shadow-sm overflow-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs uppercase bg-gray-100 text-gray-500">
              <tr>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">User Name</th>
              </tr>
            </thead>
            <tbody>
              {buildMatchedTableRows(offer, sell).map((row, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{row.type}</td>
                  <td className="px-4 py-2 font-medium">{row.amount}</td>
                  <td className="px-4 py-2">{row.user}</td>
                </tr>
              ))}
              <tr className="bg-slate-100 font-semibold text-sm">
                <td className="px-4 py-2">Remaining</td>
                <td className="px-4 py-2">{parseFloat(offer.amountRemaining).toFixed(4)} USDT</td>
                <td className="px-4 py-2">{offer.userId?.nickname || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

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

export default AdminTradeInProgressCard;
