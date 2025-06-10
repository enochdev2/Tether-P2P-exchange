import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, Star } from "lucide-react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import logo2 from "../assets/Tether2.png";
import { useState } from "react";

const statusColors = {
  "On sell": "#26a17b", // Green
  "Pending Approval": "#a0a0a0", // Grey
  "Sell completed": "#f59e0b", // Amber
};

// import your logo and statusColors accordingly

const AdminTradeInProgressCard = ({
  offer,
  sell,
  onMatch,
  onCancel,
  onMatchs,
}) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [buyerOrderId, setBuyerOrderId] = useState("");

  // Adjust isPending logic if needed
  const isPending = offer.status === "In Progress";

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
    onMatchs(offer.currentBuyOrderInProgress, offer._id); // Trigger matching in the parent component
    setIsMatchModalOpen(false); // Close the modal
    setBuyerOrderId(""); // Reset the input field
  };

  const handleMatchComplete = () => {
    onMatch(offer.currentBuyOrderInProgress, offer._id); // Trigger matching in the parent component
    setIsMatchModalOpen(false); // Close the modal
    setBuyerOrderId(""); // Reset the input field
  };
  const handleMatchCancel = () => {
    const currentOrderInProgress = sell
      ? offer.currentBuyOrderInProgress
      : offer.currentSellOrderInProgress;
    onCancel(currentOrderInProgress, offer._id); // Trigger matching in the parent component
    setIsMatchModalOpen(false); // Close the modal
    setBuyerOrderId(""); // Reset the input field
  };

  const orderType = sell ? "sell" : "buy";

  const buildMatchedTableRows = (offer, sell) => {
    const matchedOrders = sell
      ? offer.matchedBuyOrders
      : offer.matchedSellOrders;

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

  const statusColors = {
    "On sell": "#26a17b", // Green
    "Pending Approval": "#a0a0a0", // Grey
    "Sell completed": "#f59e0b", // Amber
  };

  const matchedOrders = sell
    ? offer?.matchedBuyOrders
    : offer?.matchedSellOrders;

  return (
    <div className="relative  w-full flex flex-col gap-4 items-center mb-4 rounded-xl bg-white p-2 shadow-lg border border-green-600">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start  sm:items-center justify-between w-full gap-4">
        {/* Status & Nickname */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="bg-green-600 text-white text-sm font-semibold px-3 py-2 rounded-md shadow-sm">
            Matching In Progress
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
            <p className="text-gray-400 text-sm">Total: {offer.amount} USDT</p>
            <p className="font-semibold text-md">
              Bal: {parseFloat(offer.amountRemaining).toFixed(4)} USDT
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-[#26a17b] hover:bg-green-700 text-white p-2 cursor-pointer rounded-md shadow-sm"
          >
            {isDropdownOpen ? (
              <FaChevronUp size={14} />
            ) : (
              <FaChevronDown size={14} />
            )}
          </button>

          <button
            onClick={() => navigate(`/chats/${offer._id}/${orderType}`)}
            className="bg-[#26a17b] hover:bg-green-700 cursor-pointer text-white text-sm px-3 py-2 rounded-md font-medium shadow-sm"
          >
            1:1 Chat
          </button>


          {sell &&
            (offer.status === "In Progress" ? (
              <div>
          <button
            onClick={handleMatchCancel}
            className="bg-red-600 cursor-pointer hover:bg-red-700 text-white text-sm px-3 py-2 rounded-md font-medium shadow-sm"
          >
            Cancel
          </button>
              <button
                onClick={handleMatchComplete}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-md font-medium cursor-pointer shadow-sm"
              >
                Complete-Match
              </button>

              </div>
            ) : (
              <button
                onClick={handleMatchClick}
                className="bg-cyan-600  hover:bg-cyan-600 text-white text-xs px-3 py-3 rounded-md font-semibold shadow-sm cursor-pointer"
              >
                Match
              </button>
            ))}
        </div>

        {/* ID, Status, Date */}
        <div className="text-xs text-gray-600 text-right space-y-0.5 leading-snug">
          <p className="truncate  max-w-[120px] font-mono text-gray-500">
            {offer._id}
          </p>
          <p className="font-bold text-green-700">{offer.status}</p>
          <p className="text-gray-500">{dateOnly}</p>
        </div>
      </div>

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
                <td className="px-4 py-2">
                  {parseFloat(offer.amountRemaining).toFixed(4)} USDT
                </td>
                <td className="px-4 py-2">{offer.userId?.nickname || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Match Modal */}
      {isMatchModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[95%] max-w-md border border-green-600 shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Match Seller with Buyer
            </h3>
            <input
              type="text"
              placeholder="Enter Buyer Order ID"
              className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              value={buyerOrderId}
              onChange={(e) => setBuyerOrderId(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsMatchModalOpen(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-sm text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleMatchSubmit}
                className="px-4 py-2 bg-[#26a17b] hover:bg-green-700 text-white rounded-md text-sm"
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
