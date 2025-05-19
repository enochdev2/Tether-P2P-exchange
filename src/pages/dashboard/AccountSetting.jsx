import React, { useEffect, useState } from "react";
import AccountSetting from "../../components/AccountSetting";
import InfoCard from "../../components/InfoCard";
import { Settings2Icon, SettingsIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthProvider";

function AccountSettings() {
  const { user, setIsLoggedIn, setUser } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      if (!user) {
        navigate("/");
      }
    }
  }, [navigate]);

  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

  //   if (storedUser && storedIsLoggedIn === "true") {
  //     setUser(JSON.parse(storedUser));
  //   }
  // }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

    if (storedUser && storedIsLoggedIn === "true") {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    } else {
      ("isLoggedIn");
      if (!user) {
        navigate("/");
      }
    }
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="w-full">
      <div className="md:w-[90%] mx-auto">
      <div className="flex-1">
        <InfoCard
          icon={<SettingsIcon size={24} />}
          title="Account Setting"
          // actionText=""
          onAction={() => console.log("Navigate to security questions")}
        >
          Manage your personal information, update your email and password, and
          customize your preferences to keep your account secure and tailored to
          your needs.{" "}
        </InfoCard>
      </div>
      <div className="my-4 flex justify-end">
        {/* <button disabled className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600">Change Password</button> */}
        {/* <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 mt-4">Enable 2FA</button> */}
        <button
          onClick={handleEdit}
          className="bg-cyan-700 cursor-pointer font-semibold text-white py-2 px-4 rounded hover:bg-cyan-900 mt-4"
        >
          Edit Personal Info
        </button>
      </div>
      <AccountSetting isEditing={isEditing} setIsEditing={setIsEditing} user={user} />
      </div>
    </div>
  );
}

export default AccountSettings;
