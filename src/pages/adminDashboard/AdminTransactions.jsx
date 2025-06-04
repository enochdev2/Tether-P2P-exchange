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
    <div className="border border-[#26a17b] rounded-lg p-4 mt-4 bg-white shadow-md text-sm sm:text-base">
      {/* Buyer Info */}
      <div className="bg-[#f4fdf9] border border-[#26a17b] rounded-lg p-4 space-y-3">
        <div>
          <strong>Buyer Nickname:</strong> {details.buyerNickname}
        </div>
        <div>
          <strong>Buyer Phone Number:</strong> {details.buyerPhone}
        </div>
        <div>
          <strong>Buy Request Amount:</strong> {details.buyRequestAmount}
        </div>
      </div>

      {/* Progress Header */}
      <div className="border border-[#26a17b] rounded-lg p-4 mt-4 bg-[#f4fdf9]">
        <div className="text-[#26a17b] font-semibold text-sm uppercase bg-[#e2f7f1] rounded px-3 py-1 w-fit">
          Buy Progress Record
        </div>

        {/* Progress List */}
        <div className="mt-4 divide-y divide-[#cdeee2]">
          {details.progressRecords.map((record, idx) => (
            <div
              key={idx}
              className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              {/* Type & Amount */}
              <div className="flex gap-3 items-start">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
                    record.type === "Sell"
                      ? "bg-[#dcfce7] text-[#166534]"
                      : "bg-[#e0f2fe] text-[#1e40af]"
                  }`}
                >
                  {record.type.toLowerCase()}
                </span>

                <div>
                  <div className="text-xs text-[#4B5563] font-semibold">
                    Amount
                  </div>
                  <div className="font-semibold">{record.amount}</div>
                </div>
              </div>

              {/* Nickname */}
              <div>
                <div className="text-xs text-[#4B5563] font-semibold">
                  Nickname
                </div>
                <div className="font-semibold">{record.nickname}</div>
              </div>

              {/* Fee (Optional) */}
              {record.fee && (
                <div>
                  <div className="text-xs text-[#4B5563] font-semibold">
                    Fee
                  </div>
                  <div className="font-semibold">{record.fee}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Dates Footer */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between gap-2 text-gray-700 font-medium">
          <div>
            <span className="text-gray-500 font-normal">
              Registration Date:{" "}
            </span>
            {details.registrationDate}
          </div>
          <div>
            <span className="text-gray-500 font-normal">Completed Date: </span>
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
  async function fetchSellOrders(status = "") {
    try {
      const url =
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/allmatched-orders";
      // "https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/all-orders";

      // Assuming you have an auth token stored in localStorage or cookie
      // const token = localStorage.getItem("authToken");

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
      console.log("Fetched all orders:", allOrders);

      const combinedOrders = allOrders.combinedOrders || [];

      // Sort by createdAt descending (newest first)
      combinedOrders.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrders(combinedOrders);

      return allOrders;
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
    <div className=" lg:mx-auto mt-8 px-4 font-sans text-gray-900 text-sm">
      {/* Heading */}
      <h2 className="mb-6 text-xl md:text-3xl font-bold text-center md:text-left text-[#26a17b]">
        Transactions
      </h2>

      {/* Search Bar */}
      <div className="flex flex-row sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by Posting Number"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#26a17b] text-sm"
        />
        <button
          onClick={handleSearch}
          className="px-5 py-2 bg-[#26a17b] text-white rounded-md font-medium hover:bg-emerald-700 transition"
        >
          Enter
        </button>
      </div>

      {/* Tabs */}
      <div className="flex rounded-lg overflow-hidden shadow-sm mb-4 border border-gray-200">
        {["sell", "buy"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setFilteredData(mockData[tab]);
              setExpandedPost(null);
              setSearchInput("");
            }}
            className={`w-1/2 py-2 text-sm sm:text-base font-semibold transition ${
              activeTab === tab
                ? "bg-[#26a17b] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left table-auto">
          <thead>
            <tr className="bg-[#26a17b] text-white">
              <th className="px-4 py-3 rounded-tl-md">Posting Number</th>
              <th className="px-4 py-3">Buyer</th>
              <th className="px-4 py-3">Seller</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center rounded-tr-md">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-gray-400 italic bg-white"
                >
                  No transactions found.
                </td>
              </tr>
            )}
            {filteredData.map(
              ({ postingNumber, buyer, seller, amount, status }) => (
                <React.Fragment key={postingNumber}>
                  <tr className="bg-white border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">{postingNumber}</td>
                    <td className="px-4 py-3">{buyer}</td>
                    <td className="px-4 py-3">{seller}</td>
                    <td className="px-4 py-3">${amount}</td>
                    <td
                      className={`px-4 py-3 font-semibold ${
                        status === "Completed"
                          ? "text-emerald-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {status}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleExpand(postingNumber)}
                        className="text-[#26a17b] cursor-pointer font-medium hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                  {expandedPost === postingNumber && (
                    <tr>
                      <td colSpan={6} className="p-4 bg-gray-50">
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
    </div>
  );
}
