import { CommandIcon, InfoIcon, MessageCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import LoadingSpiner from "../../components/LoadingSpiner";
import logo2 from "../../assets/Tether2.png";

const inquiries = [
  {
    title: "Edit Account Info",
    description: "I need ...",
    date: "2025-05-20",
  },
  {
    title: "Other inquiries",
    description: "Help...",
    comment: <MessageCircle size={18} />,
    date: "2025-04-13",
  },
  {
    title: "Inquiries about Buy",
    description: "Help...",
    comment: <MessageCircle size={18} />,
    date: "2025-03-13",
  },
];

// Sort inquiries by date descending
const sortedInquiries = inquiries.sort(
  (a, b) => new Date(b.date) - new Date(a.date)
);

export default function InquiryHistory() {
  const [isLoading, setIsLoading] = useState(true);
   const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

   if (isLoading) return <LoadingSpiner />;

  return (
    <div className="bg-gray-100 h-auto w-full flex flex-col items-center pt-10 font-sans">
      {/* Card container */}
      <div className="bg-slate-100 rounded-md shadow-md sm:w-[420px] md:w-4xl mx-auto py-5">
        {/* Header */}
        <div className="flex justify-center py-2 border border-gray-400 rounded-t-md bg-gray-200 mx-20 cursor-default select-none mb-4">
          <button className="text-gray-700 text-sm font-semibold rounded px-3 py-1">
            Inquiry History
          </button>
        </div>

        {/* Inquiry list */}
        <div className="divide-y divide-gray-300">
         

           <div className="">
          {sortedInquiries.map((offer, index) => (
            <Inquiry key={index} offer={offer} loading={loading} />
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}


const Inquiry = ({ offer, loading }) => {
  // offer object expected to have:
  // action: "Sell"
  // usdtAmount: e.g. 503.56
  // krwAmount: e.g. 700000
  // status: e.g. "On sell", "Pending Approval", "Sell completed"
  // statusDate: e.g. "2025-05-20"

  const timestamp = offer.date;
  const dateObj = new Date(timestamp);

  // Get date only (e.g. "2025-05-22")
  const dateOnly = dateObj.toLocaleDateString("en-CA"); // ISO-like format YYYY-MM-DD

  // Get time only (e.g. "02:38:31" or "2:38 AM")
  const timeOnly = dateObj.toLocaleTimeString("en-US", {
    hour12: false, // false for 24-hour, true for AM/PM
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  if (loading) return <LoadingSpiner />;

  return (
    <div className=" px-2 bg-slate-200">
      {loading ? (
        <div className=" w-full h-40">
          <LoadingSpiner />
        </div>
      ) : (
        <div className="flex items-center justify-between bg-white rounded-md px-2 py-3 mb-2 border cursor-pointer hover:bg-slate-100 border-gray-200">
          {/* Left Section */}
          <div className="flex flex-1 lg:flex-2 items-center w-24 mr-6">
            <div className="flex flex-1 text-lg font-semibold">
             {offer.title}
            </div>
          </div>

           {/* Separator */}
              <div className="w-2 h-9 bg-gray-300 mx-5"></div>

          <div className="flex-1">
            <div className="mt-2 font-semibold text-xl flex text-gray-900">
              {offer.description} {''} {offer.comment}
            </div>
          </div>


          {/* Right Section */}
          <div className="flex flex-1 md:flex-2 justify-end w-32">
            <div className="flex items-center space-x-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor:  "#ccc",
                }}
              />
              <span
                className={`font-semibold sm:base lg:text-lg ${
                  offer.status === "Pending Approval"
                    ? "text-gray-400"
                    : offer.status === "Sell completed"
                    ? "text-green-800"
                    : "text-green-500"
                }`}
              >
                {offer.date}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};