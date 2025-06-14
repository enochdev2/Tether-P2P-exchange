import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Clock, ChevronDown, Star } from "lucide-react";
import TradeCard2 from "../../components/TradeCard2";
import BuyTetherComponent from "../../components/BuyTetherComponent";
import { useEffect } from "react";
import LoadingSpiner from "../../components/LoadingSpiner";
import { useTranslation } from "react-i18next";

const TransactionHistory = () => {
  const {t} = useTranslation();
  const [activeLink, setActiveLink] = useState("findOffers");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellOrders();
  }, []);

  // Function to fetch buy orders, optionally filtered by status
  async function fetchSellOrders(status = "") {
    try {
      // Build the URL with optional status query parameter
      const url = status
        ? `https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/all-orders?status=${encodeURIComponent(
            status
          )}`
        : "https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/all-orders";
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


  const handleLinkClick = (link) => {
    setActiveLink(link); // Set active link when clicked
  };

  return (
   <div className="flex mt-19 flex-col lg:flex-row bg-gray-100 min-h-screen">
  {/* Sidebar Section */}
  <aside className="w-full hidden md:block lg:w-1/4 bg-white p-4 sm:p-6 shadow-lg space-y-6">
    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
        {t("buytether.findTransactionHistory")}
    </h2>

    {/* Filters */}
    <div className="space-y-4 text-gray-700">
      <div className="flex items-center justify-between">
        <span>Tether</span>
        <ChevronDown className="w-4 h-4" />
      </div>

      <div>
        <input
          type="number"
          placeholder="Enter amount"
          className="w-full px-3 py-2 border rounded-md"
          />
      </div>


      <div className="flex items-center justify-between">
          
        <label htmlFor="recent-trade">{t("buytether.recentltTraded")}</label>
        <input id="recent-trade" type="checkbox" className="accent-green-500" />
      </div>
    </div>

    {/* Find Offers Button */}
    <button
      onClick={() => handleLinkClick("findOffers")}
      className="w-full py-3 bg-green-800 hover:bg-green-700 transition text-white rounded-md text-sm sm:text-base"
    >
      
        {t("buytether.findHistory")}
    </button>
  </aside>

  {/* Main Content Section */}
  <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
    <BuyTetherComponent />

    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-green-600 mt-2">
        {t("buytether.transactionHistory")}
      </h1>

      <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm">
        {t("buytether.sortBy")}
      </button>
    </div>

    {/* Offers */}
    {loading ? (
      <LoadingSpiner />
    ) : (
      <div className="space-y-4">
        {orders.map((offer, index) => (
          <TradeCard2 key={index} offer={offer} loading={loading} />
        ))}
      </div>
    )}
  </main>
</div>

  );
};

export default TransactionHistory;
