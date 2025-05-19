import React from "react";
import { CheckCircle, Shield, Phone } from "lucide-react"; // Import relevant icons from lucide-react

const DashboardTopSection = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      {/* Header */}
      <h1 className="text-3xl font-semibold">Trade History</h1>

      {/* Info Section with Cards */}
      <div className="flex space-x-4">
        {/* Account Level */}
        <div className="flex items-center bg-white shadow-md rounded-md px-6 py-3 space-x-2">
          <span className="text-gray-800 font-semibold">Account Level: 1</span>
          <div className="bg-green-500 text-white rounded-full p-1">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Phone Verified */}
        <div className="flex items-center bg-white shadow-md rounded-md px-6 py-3 space-x-2">
          <span className="text-gray-800 font-semibold">You're Phone Verified</span>
          <div className="bg-green-500 text-white rounded-full p-1">
            <Phone className="w-5 h-5" />
          </div>
        </div>

        {/* 2FA Not Enabled */}
        <div className="flex items-center bg-white shadow-md rounded-md px-6 py-3 space-x-2">
          <span className="text-gray-800 font-semibold">2FA Not Enabled</span>
          <div className="bg-red-500 text-white rounded-full p-1">
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTopSection;
