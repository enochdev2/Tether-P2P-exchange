import React, { useState } from "react";

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
        // "https://tether-p2p-exchang-backend.onrender.com/api/v1/inquiry",
        "http://localhost:3000/api/v1/inquiry",
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
      console.log("🚀 ~ handleSubmit ~ response:", response)

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit inquiry");
      }

      const data = await response.json();
      console.log("🚀 ~ handleSubmit ~ data:", data)

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
    <>
      {/* Overlay */}
      <div
        onClick={onCancel}
        className="  bg-opacity-10 flex justify-center items-center z-[1000]"
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-[420px]  md:w-[600px] bg-gray-300 rounded-[15px] py-4 px-4 sm:px-6 font-sans text-black border shadow-md"
        >
          <h3 className="w-full text-center  mb-4 font-bold text-base md:text-lg mx-auto">
            1:1 Inquiry
          </h3>

          <div className="bg-white border rounded-2xl px-3 py-2 mb-4">
            <select
              id="inquiry-type"
              placeholder="Inquiry Type"
              value={inquiryType}
              onChange={(e) => setInquiryType(e.target.value)}
              className="w-full h-7 rounded-md border border-gray-800 text-sm pl-2 mb-2 text-center
        appearance-none bg-white cursor-pointer text-gray-800
        bg-no-repeat bg-[right_0.5rem_center] bg-[length:16px_16px]"
            >
              {/* Placeholder option */}
              <option value="" disabled hidden>
                Inquiry Type
              </option>

              {/* Actual options */}
              <option value="Edit Account Info">Edit Account Info</option>
              <option value="Sell Inquiry">Sell Inquiry</option>
              <option value="Buy Inquiry">Buy Inquiry</option>
              <option value="Other Inquiry">Other Inquiry</option>
            </select>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="User typing"
              rows={8}
              className="w-full rounded-xl border border-gray-700 p-2 text-lg font-bold font-sans resize-none mb-2 box-border"
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
    </>
  );
};

export default InquiryModal;
