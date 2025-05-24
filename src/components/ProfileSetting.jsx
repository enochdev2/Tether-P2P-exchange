import React, { useState } from "react";
import InfoCard from "./InfoCard";
import { ShieldAlertIcon, UserIcon } from "lucide-react";

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
    <div className="space-y-8">
      {/* Top grid: Phone & Username */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm md:text-base font-medium text-gray-700">
            Phone
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              value={user?.phone}
              disabled={true}
              // onChange={handlePhoneChange}
              className="w-full  px-3 py-3 border border-gray-400 rounded focus:outline-none focus:ring"
            />
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <div className="text-gray-400">
            <UserIcon size={38} className="text-[#26a17b]" />
          </div>
          <div className="flex-1">
            <label className="block text-sm md:text-base font-medium text-gray-700">
              Nickname
            </label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                type="text"
                value={user?.nickname}
                className="flex-1 px-3 py-3 border border-gray-400 rounded focus:outline-none focus:ring"
                disabled={true}
              />
              {/* <button
                onClick={handleUsernameSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Save
              </button> */}
            </div>

            {/* <div className="mt-4">
              <label className="inline-flex items-center space-x-2 cursor-pointer text-sm text-gray-700">
                <span>Upload image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">
                Upload a nice picture, preferably of yourself. If you upload any explicit or otherwise inappropriate image, we'll remove it immediately.
              </p>
            </div> */}
          </div>
        </div>
        <div>
          <label className="block text-sm md:text-base font-medium text-gray-700">
            Date Of Birth
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              value={user?.dob}
              disabled={true}
              // onChange={handlePhoneChange}
              className="w-full px-3 py-3 border-gray-400 border rounded focus:outline-none focus:ring"
            />
            {/* Country prefix dropdown */}
            <div className="absolute inset-y-0 left-0 flex items-center">
             
            </div>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <div className="text-gray-400">
            <UserIcon size={38} className="text-[#26a17b]" />
          </div>
          <div className="flex-1">
            <label className="block text-sm md:text-base font-medium text-gray-700">
              Username
            </label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                type="text"
                value={user?.username}
                // onChange={(e) => setUsername(e.target.value)}
                className="flex-1 px-3 py-3 border rounded border-gray-400 focus:outline-none focus:ring"
                disabled={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preferred currency */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Preferred currency
        </label>
        <div className="mt-1">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-48 px-3 py-2 border rounded focus:outline-none focus:ring"
          >
            <option value="KRW">Korea (KRW)</option>
            {/* <option value="USD">US Dollar (USD)</option> */}
            {/* <option value="NGN">Nigerian Naira (NGN)</option> */}
            {/* add more as needed */}
          </select>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Select which currency your Account will use
        </p>
      </div>

      {/* Security questions warning */}
      <InfoCard
        icon={<ShieldAlertIcon size={24} />}
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
