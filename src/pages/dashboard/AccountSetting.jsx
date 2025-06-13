import React, { useEffect, useState } from "react";
import AccountSetting from "../../components/AccountSetting";
import InfoCard from "../../components/InfoCard";
import PopupModal from "../../components/PopupModal";
import { Settings2Icon, SettingsIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthProvider";
import { useTranslation } from "react-i18next";

function AccountSettings() {
  const { t } = useTranslation();
  const { user, setIsLoggedIn, setUser } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);

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
      <div className="md:w-[90%] my-auto mx-auto">
        {/* <div className="flex-1">
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
      </div> */}

        <div className="flex justify-center items-center md:h-[50vh]  ">
          {showModal && (
            <PopupModal
              message={t("editinfo.inquiryInstruction")}
              // onClose={() => setShowModal(false)}
              onClose={() => navigate("/dashboard/one-on-one")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;
