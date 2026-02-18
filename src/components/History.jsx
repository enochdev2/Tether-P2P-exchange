import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import UserTradeInProgressCard from "../pages/dashboard/UserTradeInProgressCard";
import { Bankend_Url } from "../utils/AuthProvider";
import { ErrorToast } from "../utils/Error";
import BuyTetherComponent from "./BuyTetherComponent";
import LoadingSpiner from "./LoadingSpiner";
import TradeCard from "./TradeCard";

const History = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inProgressOrders, setInProgressOrders] = useState([]);

  useEffect(() => {
    fetchInProgressOrders();
    fetchSellOrders();
  }, []);

  // Function to fetch buy orders, optionally filtered by status
  async function fetchSellOrders( ) {
    try {
    

      const token = localStorage.getItem("token");

      const response = await fetch(
        // "https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/sell-orders",
        `${Bankend_Url}/api/v1/sell/sell-orders`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const sellOrders = await response.json();

      if (!response.ok) {
        const data = await response.json();
        const errorMsg = data.error || data.message || "Failed to register user";
        if (errorMsg === "Invalid or expired token") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("isLoggedIn");
          navigate("/signin");
        }
        ErrorToast(errorMsg);
      }

      const statusPriority = {
        "Pending Approval": 1,
        "On Sale": 2,
        "Sale Completed": 3,
        "In Progress": 4,
      };

      sellOrders.sort((a, b) => {
        if (statusPriority[a.status] !== statusPriority[b.status]) {
          return statusPriority[a.status] - statusPriority[b.status];
        }
        // If same status, sort by createdAt descending
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setOrders(sellOrders);
      // You can now render buyOrders in your UI
      return sellOrders;
    } catch (error) {
      console.error("Failed to fetch sell orders:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function fetchInProgressOrders() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        // "https://tether-p2p-exchang-backend.onrender.com/api/v1/sell/user/inProgress-orders",
        `${Bankend_Url}/api/v1/sell/user/inProgress-orders`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const sellInProgressOrders = await response.json();

      setInProgressOrders(sellInProgressOrders);
      //   return sellOrders;
    } catch (error) {
      console.error("Failed to fetch sell orders:", error);
      return null;
    }
  }

  if (loading) return <LoadingSpiner />;

  const Sell = true;

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
              {t("buytether.transactionHistory")}
            </h1>

            <div className="space-x-4">
              <button className="bg-gray-200 px-4 py-2 rounded-md">Sort By</button>
            </div>
          </div>

          <div className="mb-10">
            {inProgressOrders.length !== 0 && (
              <div className="">
                <h2 className="text-xl rounded-2xl shadow-lg py-2 border-slate-400 border font-bold mb-4 bg-slate-200 px-3">
                  {t("buytether.myOrdersInProgress")}
                </h2>
                {inProgressOrders.map((offer) => (
                  <UserTradeInProgressCard
                    key={offer._id}
                    offer={offer}
                    sell={Sell}
                    showChatButton={offer.status === "On Sale"}
                  />
                ))}
              </div>
            )}
          </div>
          {/* Map Over Offers Data */}

          {loading == false && orders.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              {/* My Past Trades */}
              <div className="text-center text-gray-500 text-2xl">
                <p>You haven’t traded yet or you don't have any sell Order.</p>
                <p className="mt-2 text-gray-600">Start trading now!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl rounded-2xl shadow-lg py-2 border-slate-400 border font-bold mb-4 bg-slate-200 px-3">
                {t("buytether.myOrders")}
              </h2>
              {orders.map((offer, index) => (
                <TradeCard key={index} offer={offer} sell={Sell} fetchOrders={fetchSellOrders} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
