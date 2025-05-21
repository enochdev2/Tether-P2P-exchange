import { ChevronDown } from "lucide-react";
import { useState } from "react";
import BuyTetherComponent from "./BuyTetherComponent";
import TradeCard from "./TradeCard";

const History = () => {
  const [activeLink, setActiveLink] = useState("findOffers");

  const offers = [
    {
      id: 1,
      action: "Sell",
      usdtAmount: 503.56,
      krwAmount: 700000,
      ordernumber: "12545",
      status: "On sell",
      statusDate: "2025-05-20",
    },
    {
      id: 2,
      action: "Sell",
      usdtAmount: 510.12,
      krwAmount: 705000,
      ordernumber: "12348",
      status: "Pending Approval",
      statusDate: "2025-05-19",
    },
    {
      id: 3,
      action: "Sell",
      usdtAmount: 499.98,
      krwAmount: 695000,
      ordernumber: "12375",
      status: "Sell completed",
      statusDate: "2025-05-13",
    },
    {
      id: 4,
      action: "Sell",
      usdtAmount: 503.56,
      krwAmount: 700000,
      ordernumber: "12348",
      status: "Sell completed",
      statusDate: "2025-04-28",
    },
    {
      id: 5,
      action: "Sell",
      usdtAmount: 502.34,
      krwAmount: 699000,
      ordernumber: "12345",
      status: "Sell completed",
      statusDate: "2025-04-20",
    },
    {
      id: 6,
      action: "Sell",
      usdtAmount: 508.44,
      krwAmount: 702000,
      ordernumber: "12345",
      status: "On sell",
      statusDate: "2025-05-20",
    },
  ];

  const handleLinkClick = (link) => {
    setActiveLink(link); // Set active link when clicked
  };

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

          {!offers ? (
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
              {offers.map((offer) => (
                <TradeCard key={offer.id} offer={offer} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
