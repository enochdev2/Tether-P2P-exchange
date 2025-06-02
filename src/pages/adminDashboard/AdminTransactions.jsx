import React, { useEffect, useState } from "react";

const mockData = {
  sell: [
    {
      postingNumber: "S123abc456",
      buyer: "Buyer2",
      seller: "Seller2",
      amount: "500 USDT",
      status: "Completed",
      details: {
        buyerNickname: "Buyer2",
        buyerPhone: "010-5678-1234",
        buyRequestAmount: "500 USDT",
        progressRecords: [
          { type: "Sell", amount: "1500 USDT", nickname: "Seller2", fee: null },
          {
            type: "Buy",
            amount: "500 USDT",
            nickname: "Buyer2",
            fee: "5 USDT",
          },
        ],
        registrationDate: "2025-05-27 13:00:00",
        completionDate: "2025-05-27 13:05:00",
      },
    },
  ],
  buy: [
    {
      postingNumber: "A13dfer3412",
      buyer: "Buyer1",
      seller: "Seller1",
      amount: "250 USDT",
      status: "Completed",
      details: {
        buyerNickname: "Buyer1",
        buyerPhone: "010-1234-1234",
        buyRequestAmount: "250 USDT",
        progressRecords: [
          { type: "Sell", amount: "1000 USDT", nickname: "Seller1", fee: null },
          {
            type: "Buy",
            amount: "250 USDT",
            nickname: "Buyer1",
            fee: "2.5 USDT",
          },
        ],
        registrationDate: "2025-05-27 14:05:58",
        completionDate: "2025-05-27 14:09:22",
      },
    },
  ],
};

function TransactionDetails({ details }) {
  return (
    <div className="border border-slate-400 rounded-md py-4 px-2 mt-2 space-y-3 bg-slate-50">
      <div className="border px-3 space-y-3 text-base py-2 border-slate-400 rounded-2xl">
        <div className="">
          <strong>Buyer Nickname:</strong> {details.buyerNickname}
        </div>
        <div className="">
          <strong>Buyer Phone number:</strong> {details.buyerPhone}
        </div>
        <div className="">
          <strong>Buy Request Amount:</strong> {details.buyRequestAmount}
        </div>
      </div>
      <div className="border border-gray-400 px-3 rounded-2xl py-2">
        <div className="border border-slate-400 rounded-md p-2 mt-4 bg-slate-200 text-sm font-semibold w-max select-none">
          Buy progress record
        </div>

        <div className="border-t border-slate-400 mt-4">
          {details.progressRecords.map((record, idx) => (
            <div
              key={idx}
              className={`flex justify-between py-2 border-b ${
                idx !== details.progressRecords.length - 1
                  ? "border-slate-400"
                  : "border-none"
              }`}
            >
              <div className="flex gap-3 items-center">
                <div
                  className={`px-2 rounded text-xs font-semibold capitalize ${
                    record.type === "Sell"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-200 text-blue-800"
                  }`}
                >
                  {record.type.toLowerCase()}
                </div>
                <div>
                  <div className="bg-yellow-200 px-2 rounded text-xs font-semibold">
                    Amount
                  </div>
                  <div className="font-semibold text-sm">{record.amount}</div>
                </div>
              </div>

              <div className="">
                <div className="bg-yellow-200 px-2 rounded text-xs font-semibold flex items-center">
                  Nickname
                </div>
                <div className="font-semibold text-sm flex items-center">
                  {record.nickname}
                </div>
              </div>

              {record.fee && (
                <div className="">
                  <div className="bg-yellow-200 px-2 rounded text-xs font-semibold flex items-center">
                    Fee
                  </div>
                  <div className="font-semibold text-sm flex items-center">
                    {record.fee}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between font-semibold text-sm">
          <div>
            <span className="font-normal">Buy Post Registration Date: </span>
            {details.registrationDate}
          </div>
          <div>
            <span className="font-normal">Buy Completed Date: </span>
            {details.completionDate}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminTransactions() {
  const [activeTab, setActiveTab] = useState("buy");
  const [searchInput, setSearchInput] = useState("");
  const [expandedPost, setExpandedPost] = useState(null);
  const [filteredData, setFilteredData] = useState(mockData.buy);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellOrders();
  }, []);

  // Function to fetch buy orders, optionally filtered by status
  const url = "https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/allmatched-orders";
  async function fetchSellOrders() {
  try {
    // const url = "https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/allmatched-orders";

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const allOrders = await response.json();

    const formatted = {
      buy: [],
      sell: [],
    };

    allOrders.forEach((order, index) => {
      const isBuy = order.status === "Buy Completed";
      const isSell = order.status === "Sale Completed";
      const buyerName = order.userId?.nickname || "Unknown";
      const sellerMatches = order.matchedSellOrders || [];
      const buyerMatches = order.matchedBuyOrders || [];

      const commonData = {
        postingNumber: order._id.slice(-12), // or use index or generated code
        buyer: isBuy ? buyerName : buyerMatches[0]?.nickname || "N/A",
        seller: isSell ? buyerName : sellerMatches[0]?.nickname || "N/A",
        amount: `${order.amount} USDT`,
        status: "Completed",
        details: {
          buyerNickname: buyerName,
          buyerPhone: order.userId?.phone || "N/A",
          buyRequestAmount: `${order.amount} USDT`,
          progressRecords: [
            ...sellerMatches.map((match) => ({
              type: "Sell",
              amount: `${match.amount} USDT`,
              nickname: match.nickname || "N/A",
              fee: null,
            })),
            ...buyerMatches.map((match) => ({
              type: "Buy",
              amount: `${match.amount} USDT`,
              nickname: match.nickname || "N/A",
              fee: order.fee ? `${order.fee} USDT` : null,
            })),
          ],
          registrationDate: new Date(order.createdAt).toLocaleString(),
          completionDate: new Date(order.updatedAt).toLocaleString(),
        },
      };

      if (isBuy) formatted.buy.push(commonData);
      if (isSell) formatted.sell.push(commonData);
    });

    setOrders(allOrders);
    setFilteredData(formatted[activeTab]);
    return formatted;
  } catch (error) {
    console.error("Failed to fetch sell orders:", error);
    return null;
  } finally {
    setLoading(false);
  }
}


  const handleSearch = () => {
    const data = activeTab === "buy" ? mockData.buy : mockData.sell;
    if (!searchInput.trim()) {
      setFilteredData(data);
      setExpandedPost(null);
      return;
    }
    const filtered = data.filter((item) =>
      item.postingNumber
        .toLowerCase()
        .includes(searchInput.trim().toLowerCase())
    );
    setFilteredData(filtered);
    setExpandedPost(null);
  };

  const toggleExpand = (postingNumber) => {
    setExpandedPost((prev) => (prev === postingNumber ? null : postingNumber));
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 font-sans text-slate-900 text-sm">
      <h2 className="mb-4 text-sm md:text-3xl font-semibold">Transactions</h2>
      <div className="flex items-center gap-2 mb-3">
        <input
          type="text"
          placeholder="Posting Unique Number"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="px-2 py-1 border border-slate-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-1 bg-slate-600 text-white rounded hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          Enter
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-600 rounded-b-lg overflow-hidden">
        {["sell", "buy"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setFilteredData(mockData[tab]);
              setExpandedPost(null);
              setSearchInput("");
            }}
            className={`flex-1 py-2 text-center font-semibold cursor-pointer ${
              activeTab === tab
                ? "bg-slate-700 text-white"
                : "bg-slate-300 text-slate-700 hover:bg-slate-400"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <table className="w-full border-separate border-spacing-y-2 mt-3">
        <thead>
          <tr className="bg-slate-200 text-left text-slate-700 font-semibold text-sm rounded-lg">
            <th className="px-3 py-2 rounded-tl-md">Posting Number</th>
            <th>Buyer</th>
            <th>Seller</th>
            <th>Amount</th>
            <th>Status</th>
            <th className="text-center rounded-tr-md">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-5 text-slate-400">
                No transactions found.
              </td>
            </tr>
          )}
          {filteredData.map(
            ({ postingNumber, buyer, seller, amount, status }) => (
              <React.Fragment key={postingNumber}>
                <tr className="bg-white shadow rounded-lg align-middle">
                  <td className="px-3 py-2">{postingNumber}</td>
                  <td>{buyer}</td>
                  <td>{seller}</td>
                  <td>{amount}</td>
                  <td
                    className={`font-semibold ${
                      status === "Completed"
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {status}
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => toggleExpand(postingNumber)}
                      className="text-blue-600 font-semibold underline cursor-pointer hover:text-blue-800"
                      aria-label={`View details for ${postingNumber}`}
                    >
                      View Details
                    </button>
                  </td>
                </tr>

                {expandedPost === postingNumber && (
                  <tr>
                    <td colSpan={6} className="p-0">
                      <TransactionDetails
                        details={
                          filteredData.find(
                            (t) => t.postingNumber === postingNumber
                          ).details
                        }
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
