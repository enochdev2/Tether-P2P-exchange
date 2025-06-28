import React, { useEffect, useState } from "react";
import InfoCard from "./InfoCard";
import {
  Banknote,
  BanknoteIcon,
  Calendar,
  PhoneIcon,
  PiggyBank,
  ShieldAlertIcon,
  User,
  User2,
  User2Icon,
  UserCircle2,
  UserIcon,
  VaultIcon,
  Wallet2Icon,
} from "lucide-react";
import { useAuth } from "../utils/AuthProvider";
import { SuccessToast } from "../utils/Success";
import { ErrorToast } from "../utils/Error";
import { useTranslation } from "react-i18next";

export default function AccountSetting({ isEditing, setIsEditing, user }) {
  const { t } = useTranslation();
  const { updateUser } = useAuth();

  const [phone, setPhone] = useState(user?.phone);
  const [username, setUsername] = useState(user?.username);
  const [image, setImage] = useState(null);
  const [nickname, setNickname] = useState(user?.nickname);
  const [fullName, setFullName] = useState(user?.fullName);
  const [dob, setDob] = useState(user?.dob);
  const [bankName, setBankName] = useState(user?.bankName);
  const [bankAccount, setBankAccount] = useState(user?.bankAccount);
  const [tetherAddress, setTetherAddress] = useState(user?.tetherAddress);
  const [status, setStatus] = useState(user?.status);

  const [isLoading, setIsLoading] = useState(false);

  

   

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true); // Show loading state

    const updatedUser = {
      phone,
      username,
      nickname,
      fullName,
      dob,
      bankName,
      bankAccount: Number(bankAccount),
      tetherAddress,
      status,
      admin: user?.admin || false, // preserve existing admin status
    };

    try {
      const response = await updateUser(updatedUser);
      if (response) {
      SuccessToast(t("message.dataUpdated"));

        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      ErrorToast(`something went wrong ${error}`);
      // Optionally handle error here (e.g., show error message)
    } finally {
      setIsLoading(false); // Hide loading state after completion
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0] ?? null;
    if (file) setImage(file);
    // upload logic...
  };

  return (
    <div className="space-y-8 mt-10">
      {/* Top grid: Phone & Username */}
      <form action="" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Username */}
          <div className="flex items-center space-x-4">
            <div className="text-gray-400">
              <UserIcon size={28}  className="text-[#26a17b]"/>
            </div>
            <div className="flex-1">
              <label className="block text-sm md:text-base font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <input
                  type="text"
                  value={username || user?.username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="flex-1 px-3 py-3 border-gray-400 border rounded focus:outline-none focus:ring"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Nickname */}
          <div className="flex items-center space-x-4">
            <div className="text-gray-400">
              <UserCircle2 size={28} className="text-[#26a17b]" />
            </div>
            <div className="flex-1">
              <label className="block text-sm md:text-base font-medium text-gray-700">
                Nickname
                 {isEditing && <span className="text-sm ml-8 text-red-600/60"> * Nickname can not be edited</span>}
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <input
                  type="text"
                  value={nickname || user?.nickname }
                  onChange={(e) => setNickname(e.target.value)}
                  className="flex-1 px-3 py-3 border-gray-400 border rounded focus:outline-none focus:ring"
                  disabled={true}
                />
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="flex items-center space-x-4">
            <div className="text-gray-400">
              <User2 size={28} className="text-[#26a17b]" />
            </div>
            <div className="flex-1">
              <label className="block text-sm md:text-base font-medium text-gray-700">
                Full Name
              {isEditing && <span className="text-sm ml-8 text-red-600/60"> * Full name can not be edited</span>}
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <input
                  type="text"
                  value={fullName || user?.fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="flex-1 px-3 py-3 border-gray-400 border rounded focus:outline-none focus:ring"
                  disabled={true}
                />
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center space-x-4">
            <div className="text-gray-400">
              <PhoneIcon size={28} className="text-[#26a17b]" />
            </div>
            <div className="flex-1">
              <label className="block text-sm md:text-base font-medium text-gray-700">
                Phone
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <input
                  type="text"
                  value={phone || user?.phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 px-3 py-3 border-gray-400 border rounded focus:outline-none focus:ring"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Date of Birth */}
          <div className="flex items-center space-x-4">
            <div className="text-gray-400">
              <Calendar size={28} className="text-[#26a17b]" />
            </div>
            <div className="flex-1">
              <label className="block text-sm md:text-base font-medium text-gray-700">
                Date of Birth
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <input
                  type="date"
                  value={dob || user?.dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="flex-1 px-3 py-3 border-gray-400 border rounded focus:outline-none focus:ring"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Bank Name */}
          <div className="flex items-center space-x-4">
            <div className="text-gray-400">
              <PiggyBank size={28} className="text-[#26a17b]" />
            </div>
            <div className="flex-1">
              <label className="block text-sm md:text-base font-medium text-gray-700">
                Bank Name
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <input
                  type="text"
                  value={bankName || user?.bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="flex-1 px-3 py-3 border-gray-400 border rounded focus:outline-none focus:ring"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Bank Account */}
          <div className="flex items-center space-x-4">
            <div className="text-gray-400">
              <BanknoteIcon size={28} className="text-[#26a17b]" />
            </div>
            <div className="flex-1">
              <label className="block text-sm md:text-base font-medium text-gray-700">
                Bank Account
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <input
                  type="text"
                  value={bankAccount || user?.bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="flex-1 px-3 py-3 border-gray-400 border rounded focus:outline-none focus:ring"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Tether Address */}
          <div className="flex items-center space-x-4">
            <div className="text-gray-400">
              <Wallet2Icon size={28} className="text-[#26a17b]" />
            </div>
            <div className="flex-1">
              <label className="block text-sm md:text-base font-medium text-gray-700">
                Tether Address
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <input
                  type="text"
                  value={tetherAddress || user?.tetherAddress}
                  onChange={(e) => setTetherAddress(e.target.value)}
                  className="flex-1 px-3 py-3 border-gray-400 border rounded focus:outline-none focus:ring"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-4">
            <div className="text-gray-400">
              <VaultIcon size={28} className="text-[#26a17b]" />
            </div>
            <div className="flex-1">
              <label className="block text-sm md:text-base font-medium text-gray-700">
                Status
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <input
                  type="text"
                  value={status || user?.status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="flex-1 px-3 py-3 border-gray-400 border rounded focus:outline-none focus:ring"
                  disabled={true}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="w-full flex justify-center">
            <button
              type="submit"
              disabled={!isEditing || isLoading }
              className="bg-cyan-700 cursor-pointer font-semibold text-white py-2 px-4 mx-auto rounded hover:bg-cyan-900 mt-4"
            >
              {isLoading ? "Saving..." : "Submit"}
            </button>
          </div>
        </div>
      </form>

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
