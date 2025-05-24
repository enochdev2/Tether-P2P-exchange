import React, { useEffect } from "react";
import ProfileCard from "../../components/ProfileCard";
import InfoCard from "../../components/InfoCard";
import AccountSetting from "../../components/AccountSetting";
import ProfileSetting from "../../components/ProfileSetting";
import {
  Banknote,
  BanknoteIcon,
  PiggyBank,
  ShieldAlertIcon,
  Wallet2Icon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthProvider";

function ProfileOverview() {
  const { user, setIsLoggedIn, setUser } = useAuth();
  const navigate = useNavigate();

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

  const tether = `Wallet Address:  ${user?.tetherAddress}`;

  return (
    <div className="w-full space-y-6">
      <div className="w-full md:w-[90%] mx-auto space-y-6">
        <div className=" mt-4 "></div>

        <ProfileCard user={user} />
        <ProfileSetting user={user} />

        <InfoCard
          icon={<Wallet2Icon size={24} />}
          title={tether}
          // actionText="Set answers"
          // onAction={() => console.log("Navigate to security questions")}
        />
        <div className="flex w-full space-x-6 my-4">
          <div className="flex-1">
            <InfoCard
              icon={<PiggyBank size={24} />}
              title="Bank Name"
              actionText={user?.bankName}
              onAction={() => console.log("Navigate to security questions")}
            />
          </div>
          <div className="flex-1">
            <InfoCard
              icon={<BanknoteIcon size={24} />}
              title="Bank Accpunt Number"
              actionText={user?.bankAccount}
              onAction={() => console.log("Navigate to security questions")}
            />
          </div>
        </div>
        <InfoCard />
      </div>
    </div>
  );
}

export default ProfileOverview;