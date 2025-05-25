import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const InquiryModal = ({ isOpen, onCancel,  onSubmit }) => {
  const [inquiryType, setInquiryType] = useState("Edit Account Info");
  const [message, setMessage] = useState("");
const navigate = useNavigate();

  if (!isOpen) return null;

const handleCancel = () => {
  onCancel(); // close modal if needed
  navigate("/dashboard/profile"); // go to homepage
};


  return (
    <div
      onClick={handleCancel}
      className="fixed inset-0 z-[1000] bg-black/80 bg-opacity-50 flex justify-center items-center px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md md:max-w-xl bg-white rounded-2xl shadow-lg p-5 md:p-8 font-sans text-gray-800 space-y-6 overflow-y-auto max-h-[90vh]"
      >
        {/* Title */}
        <h3 className="text-center text-lg md:text-xl font-bold">
          1:1 Inquiry
        </h3>

        {/* Form */}
        <div className="space-y-4">
          {/* Inquiry Type */}
          <select
            id="inquiry-type"
            value={inquiryType}
            onChange={(e) => setInquiryType(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#26a17b] bg-white"
          >
            <option value="" disabled hidden>
              Select Inquiry Type
            </option>
            <option value="Edit Account Info">Edit Account Info</option>
            <option value="Sell Inquiry">Sell Inquiry</option>
            <option value="Buy Inquiry">Buy Inquiry</option>
            <option value="Other Inquiry">Other Inquiry</option>
          </select>

          {/* Message */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm md:text-base resize-none focus:outline-none focus:ring-2 focus:ring-[#26a17b]"
          />
        </div>

        {/* Buttons */}
        <div className="flex cursor-pointer flex-col md:flex-row justify-center gap-4 mt-4">
          <button
            onClick={() => onSubmit({ inquiryType, message })}
            className="w-full cursor-pointer md:w-1/2 py-2 bg-gradient-to-br from-[#26a17b] to-[#0d4e3a] text-white rounded-lg hover:bg-green-700 transition text-sm md:text-base"
          >
            Submit
          </button>
          <button
            onClick={handleCancel}
            className="w-full cursor-pointer md:w-1/2 py-2 border border-gray-400 text-gray-600 rounded-lg hover:bg-gray-100 transition text-sm md:text-base"
          >
            Cancel
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default InquiryModal;
