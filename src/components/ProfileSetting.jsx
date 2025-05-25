import React, { useState } from "react";
import InfoCard from "./InfoCard";
import { FaUserAlt, FaShieldAlt, FaPhoneAlt, FaBirthdayCake } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";

export default function ProfileSetting({user}) {
  const [phone, setPhone] = useState("+234567891");
  const [username, setUsername] = useState("ChoiceKoala891");
  const [currency, setCurrency] = useState("KRW");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    // add validation if needed
  };

  const handleUsernameSave = () => {
    // call API to save username
    console.log("Save username", username);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0] ?? null;
    if (file) setImage(file);
    // upload logic...
  };

  return (
    <div className="space-y-10 px-4 sm:px-6 lg:px-8 py-8 bg-white rounded-lg shadow-md">
      {/* Top grid: Phone & Nickname */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center gap-2">
              <FaPhoneAlt className="text-[#26a17b]" />
              Phone Number
            </div>
          </label>
          <input
            type="text"
            value={user?.phone}
            disabled
            className="w-full px-4 py-3 rounded-md border border-gray-300 bg-gray-100 text-gray-800"
          />
        </div>

        {/* Nickname */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center gap-2">
              <FaUserAlt className="text-[#26a17b]" />
              Nickname
            </div>
          </label>
          <input
            type="text"
            value={user?.nickname}
            disabled
            className="w-full px-4 py-3 rounded-md border border-gray-300 bg-gray-100 text-gray-800"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center gap-2">
              <FaBirthdayCake className="text-[#26a17b]" />
              Date of Birth
            </div>
          </label>
          <input
            type="text"
            value={user?.dob}
            disabled
            className="w-full px-4 py-3 rounded-md border border-gray-300 bg-gray-100 text-gray-800"
          />
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center gap-2">
              <AiOutlineUser className="text-[#26a17b]" />
              Username
            </div>
          </label>
          <input
            type="text"
            value={user?.username}
            disabled
            className="w-full px-4 py-3 rounded-md border border-gray-300 bg-gray-100 text-gray-800"
          />
        </div>
      </div>

      {/* Preferred Currency */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Preferred Currency
        </label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full max-w-xs px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#26a17b] bg-white"
        >
          <option value="KRW">Korea (KRW)</option>
          {/* Add more options if needed */}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          This will determine how values are displayed in your account.
        </p>
      </div>

      {/* Security Questions */}
      <InfoCard
        icon={<FaShieldAlt className="text-[#26a17b]" size={20} />}
        title="Security Questions Required"
        actionText="Set answers"
        onAction={() => console.log("Navigate to security questions")}
      >
        It is mandatory to set answers to your security questions in case you
        have to reset or change the phone number.
      </InfoCard>
    </div>
  );
}
