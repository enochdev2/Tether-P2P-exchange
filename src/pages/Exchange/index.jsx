import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Clock, ChevronDown, Star } from "lucide-react";
import TradeCard from "../../components/TradeCard";
import BuyTetherComponent from "../../components/BuyTetherComponent";
import { useEffect } from "react";
import LoadingSpiner from "../../components/LoadingSpiner";

const TradingPage = () => {
  const [activeLink, setActiveLink] = useState("findOffers");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Example data for trading offers
  const offers = [
    {
      id: 1,
      action: "Buy",
      usdtAmount: 503.56,
      krwAmount: 700000,
      ordernumber: "12545",
      status: "On Buy",
      statusDate: "2025-05-20",
    },
    {
      id: 2,
      action: "Buy",
      usdtAmount: 510.12,
      krwAmount: 705000,
      ordernumber: "12348",
      status: "Pending Approval",
      statusDate: "2025-05-19",
    },
    {
      id: 3,
      action: "Buy",
      usdtAmount: 499.98,
      krwAmount: 695000,
      ordernumber: "12375",
      status: "Buy completed",
      statusDate: "2025-05-13",
    },
    {
      id: 4,
      action: "Buy",
      usdtAmount: 503.56,
      krwAmount: 700000,
      ordernumber: "12348",
      status: "Buy completed",
      statusDate: "2025-04-28",
    },
    {
      id: 5,
      action: "Buy",
      usdtAmount: 502.34,
      krwAmount: 699000,
      ordernumber: "12345",
      status: "Buy completed",
      statusDate: "2025-04-20",
    },
    {
      id: 6,
      action: "Buy",
      usdtAmount: 508.44,
      krwAmount: 702000,
      ordernumber: "12345",
      status: "On Buy",
      statusDate: "2025-05-20",
    },
  ];

  useEffect(() => {
    fetchBuyOrders();
  }, []);

  // Function to fetch buy orders, optionally filtered by status
  async function fetchBuyOrders(status = "") {
    try {
      // Build the URL with optional status query parameter
      const url = status
        ? `/api/buy-orders?status=${encodeURIComponent(status)}`
        : // : "https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/buy-orders";
          "http://localhost:3000/api/v1/buy/buy-orders";

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

      const buyOrders = await response.json();
      console.log("Fetched buy orders:", buyOrders);

       const statusPriority = {
        "Waiting for Buy": 1,
        "Buy Completed": 2,
      };

      buyOrders.sort((a, b) => {
        if (statusPriority[a.status] !== statusPriority[b.status]) {
          return statusPriority[a.status] - statusPriority[b.status];
        }
        // If same status, sort by createdAt descending
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setOrders(buyOrders);
      // You can now render buyOrders in your UI
      return buyOrders;
    } catch (error) {
      console.error("Failed to fetch buy orders:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }

  // Example usage:
  // fetchBuyOrders("Waiting for Buy").then((orders) => {
  //   if (orders) {
  //     // Render the orders on your page here
  //     orders.forEach((order) => {
  //       console.log(
  //         `Order #${order._id}: Amount=${order.amount}, Status=${order.status}`
  //       );
  //     });
  //   }
  // });

  const handleLinkClick = (link) => {
    setActiveLink(link); // Set active link when clicked
  };

  if (loading) return <LoadingSpiner />;

  return (
    <div>
      {/* <div className="block w-full"> */}
      {/* Filters and Export Section */}
      {/* <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button className="py-2 px-4 bg-gray-200 rounded-md">Filters</button>
              <button className="py-2 px-4 bg-gray-200 rounded-md">Export Trades</button>
            </div>
            <div className="flex space-x-4">
              <p className="text-sm">Completed Trades: 0%</p>
              <p className="text-sm">(0 trades out of 0)</p>
            </div>
          </div>
        </div> */}

      {/* </div> */}
      <div className="flex bg-gray-100 pt-2 min-h-screen">
        {/* Main Content Section */}
        <div className="flex-1 p-6 overflow-y-auto">
          <BuyTetherComponent />
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-br from-green-600 via-[#26a17b] to-green-800 text-transparent bg-clip-text mt-5">
              Transaction History
            </h1>

            <div className="space-x-4">
              <button className="bg-gray-200 px-4 py-2 rounded-md">
                Sort By
              </button>
            </div>
          </div>
          {/* Map Over Offers Data */}

          {loading == false && !orders ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              {/* My Past Trades */}
              <h2 className="text-xl font-semibold mb-4">My Past Trades</h2>
              <div className="text-center text-gray-500">
                <p>You haven’t traded yet.</p>
                <p className="mt-2 text-gray-600">Start trading now!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((offer, index) => (
                <TradeCard key={index} offer={offer} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradingPage;
