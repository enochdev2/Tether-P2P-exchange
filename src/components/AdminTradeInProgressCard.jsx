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
    <div className="relative flex flex-col items-center rounded-lg px-2 py-2  mb-4 bg-slate-200 shadow-sm">
      <div className="flex flex-col w-full sm:flex-row  border-green-300 py-2 px-2  bg-green-100 border shadow-sm items-center rounded-lg cursor-pointer  ">
        <div className="flex items-center space-x-2">
          <div className="bg-green-600 text-white font-semibold px-2 py-1 rounded-md text-sm">
            Matching In Progress
          </div>
          <div
            className="bg-slate-200 px-3 py-1 rounded-md cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {offer?.userId?.nickname || "Nickname"}
          </div>
        </div>

        <div className="flex items-center ml-4">
          <img src={logo2} alt="Tether" className="w-5 h-5 mr-2" />
          <div>
            <div className="text-xs text-gray-400">
              Total: {offer.amount} USDT
            </div>
            <div className="text-sm text-black">
              Bal: {parseFloat(offer.amountRemaining).toFixed(4)} USDT
            </div>
          </div>
        </div>

        <div className="flex items-center ml-auto space-x-2">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-[#26a17b] text-white px-3 cursor-pointer py-1 rounded text-sm"
          >
            {isDropdownOpen ? (
              <FaChevronUp size={20} />
            ) : (
              <FaChevronDown size={20} />
            )}
          </button>
          <button
            onClick={() => navigate(`/chats/${offer._id}/${orderType}`)}
            className="bg-[#26a17b] text-white px-3 py-1 rounded text-sm"
          >
            1:1 Chat
          </button>
          <button
            onClick={handleMatchCancel}
            className="bg-[#26a17b] text-white px-3 py-1 rounded text-xs lg:text-base"
          >
            Cancel
          </button>

          {sell && (
            <div>
              {offer.status === "In Progress" ? (
                <button
                  onClick={handleMatchComplete}
                  className="bg-[#26a17b] text-white px-3 py-1 rounded text-xs lg:text-base"
                >
                  Complete-Match
                </button>
              ) : (
                <button
                  onClick={handleMatchClick}
                  className="mt- px-2 py-2 cursor-pointer bg-[#26a17b] hover:bg-green-700 text-white rounded text-xs md:text-sm font-bold"
                >
                  Match
                </button>
              )}
            </div>
          )}
        </div>

        <div className="text-xs text-right ml-4">
          <div>{offer._id}</div>
          <div className="text-green-700 font-bold">{offer.status}</div>
          <div>{dateOnly}</div>
        </div>
      </div>

      {isDropdownOpen && (
        <div className=" transform -trans top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 w-full max-w- p-4">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs uppercase text-gray-500 border-b">
              <tr>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">User Name</th>
              </tr>
            </thead>
            <tbody>
              {buildMatchedTableRows(offer, sell).map((row, i) => (
                <tr className=" border-b border-b-gray-300" key={i}>
                  <td className="px-4 py-2">{row.type}</td>
                  <td className="px-4 py-2 font-medium">{row.amount}</td>
                  <td className="px-4 py-2">{row.user}</td>
                </tr>
              ))}

              <tr className="bg-slate-100 font-semibold">
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

      {isMatchModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 border border-green-700 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
              Match Seller with Buyer
            </h3>
            <input
              type="text"
              className="border border-gray-300 rounded-md p-2 mb-4 w-full"
              placeholder="Enter Buyer Order ID"
              value={buyerOrderId}
              onChange={(e) => setBuyerOrderId(e.target.value)}
            />
            <div className="flex justify-between">
              <button
                onClick={() => setIsMatchModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleMatchSubmit}
                className="px-4 py-2 bg-[#26a17b] text-white rounded-md"
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
