import { CommandIcon, InfoIcon, MessageCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import LoadingSpiner from "../../components/LoadingSpiner";

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
      <div className="bg-white rounded-md shadow-md sm:w-[420px] md:w-4xl mx-auto py-5">
        {/* Header */}
        <div className="flex justify-center py-2 border border-gray-400 rounded-t-md bg-gray-200 mx-20 cursor-default select-none mb-4">
          <button className="text-gray-700 text-sm font-semibold rounded px-3 py-1">
            Inquiry History
          </button>
        </div>

        {/* Inquiry list */}
        <div className="divide-y divide-gray-300">
          {sortedInquiries.map(({ title, description, date, comment }, idx) => (
            <div
              key={idx}
              className="flex items-center  px-4 py-3 hover:bg-gray-50 cursor-default"
            >
              {/* Title */}
              <div className="flex-1 text-sm text-gray-800 truncate">
                {title}
              </div>

              {/* Separator */}
              <div className="w-2 h-9 bg-gray-300 mx-2"></div>

              {/* Description */}
              <div className="flex-1 flex text-sm text-gray-600 truncate">
                {description}
                {comment}
              </div>
              {/* Info icon (circle with small dash) */}
              <div
                className=" flex-1 space-x-3 mx-2 flex select-none cursor-pointer"
                title="More info"
              ></div>

              {/* Date */}
              <div className="text-xs text-gray-700 w-24 text-right select-none">
                {date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
