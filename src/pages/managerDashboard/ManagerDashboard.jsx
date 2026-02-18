import { useState } from "react";
import { Outlet } from "react-router-dom"; // Import Outlet for dynamic content rendering
import AlarmBell from "../../components/AlarmBell";
import ManagerSidebar from "./SidebarManager";

const ManagerDashboard = () => {
  // const { t } = useTranslation();
  const [isOn, setIsOn] = useState(true);

  return (
    <div className="flex mt-19 min-h-screen bg-gray-100 overflow-x-auto">
      {/* Sidebar Section */}
      <div className=" bg-white shadow-md">
        <ManagerSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1  p-4 sm:p-6 lg:p-8 space-y-4 overflow-y-auto">
        {/* Header */}
        <div className="border-b flex items-center px-2 sm:px-3 py-3 border-slate-300 shadow-sm">
          {/* <h1 className="text-2xl sm:text-3xl font-bold">{t("AdminDashboard")}</h1> */}
          <h1 className="text-2xl sm:text-3xl font-bold">
            Manager Dashboard <span className="text-lg">Referral Code: QWET4</span>
          </h1>
        </div>

        {/* Dynamic Content Rendering */}
        <Outlet />
      </div>
      <div className="fixed bottom-6 right-6 z-50 flex items-end  gap-x-1 ">
        <AlarmBell setIsOn={setIsOn} isOn={isOn} />
      </div>
    </div>
  );
};

export default ManagerDashboard;
