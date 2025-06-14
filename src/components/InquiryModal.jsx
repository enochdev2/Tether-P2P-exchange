import React, { useState } from "react";
import { SuccessToast } from "../utils/Success";
import { useTranslation } from "react-i18next";

const InquiryModal = ({ isOpen, onCancel }) => {
  const { t } = useTranslation();
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
      onCancel();
      SuccessToast("Your inquiry has been submitted.");
      // onCancel();
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
        <h3 className="text-center text-lg md:text-xl font-bold">{t("inquirys.title")}</h3>

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
              {t("inquirys.selectType")}
            </option>
            <option value="Edit Account Info">{t("inquirys.editAccount")}</option>
            <option value="Sell Inquiry">{t("inquirys.sellInquiry")}</option>
            <option value="Buy Inquiry">{t("inquirys.buyInquiry")}</option>
            <option value="Other Inquiry">{t("inquirys.otherInquiry")}</option>
          </select>

          {/* Message */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("inquirys.placeholder")}
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm md:text-base resize-none focus:outline-none focus:ring-2 focus:ring-[#26a17b]"
          />
        </div>

        <div className="flex justify-center space-x-6 md:space-x-8">
          <button
            onClick={onCancel}
            className="cursor-pointer w-24 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-150"
          >
            {t("inquirys.cancel")}
          </button>
          <button
            onClick={() => handleSubmit()}
            className="w-24 py-2 rounded-lg border border-transparent bg-[#26a17b] hover:bg-green-700 text-white text-sm font-medium shadow-sm focus:outline-none cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
          >
            {t("inquirys.submit")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InquiryModal;
