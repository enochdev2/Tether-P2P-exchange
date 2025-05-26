import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const InquiryModal = ({ isOpen, onCancel, onSubmit }) => {
  const [inquiryType, setInquiryType] = useState("Edit Account Info");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      // Assuming your backend API endpoint for inquiry creation
      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/inquiry",
        // "http://localhost:3000/api/v1/inquiry",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: inquiryType,
            description: message,
          }),
        }
      );
      console.log("🚀 ~ handleSubmit ~ response:", response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit inquiry");
      }

      const data = await response.json();
      console.log("🚀 ~ handleSubmit ~ data:", data);

      // Optionally, reset form or close modal here
      setInquiryType("Edit Account Info");
      setMessage("");
      // onCancel();
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      // onClick={handleCancel}
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

        <div className="flex justify-center space-x-10 md:space-x-26">
          <button
            onClick={onCancel}
            className="w-[90px] py-1 rounded-md border border-gray-500 bg-gray-200 text-sm cursor-pointer"
          >
            Cancle
          </button>
          <button
            onClick={() => handleSubmit()}
            className="w-[90px] py-1 rounded-md border border-slate-500 bg-slate-300 hover:bg-slate-600 text-sm cursor-pointer"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default InquiryModal;
