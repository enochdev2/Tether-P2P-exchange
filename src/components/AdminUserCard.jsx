import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, Star } from "lucide-react";
import logo2 from "../assets/Tether2.png";
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import { SuccessToast } from "../utils/Success";
import { ErrorToast } from "../utils/Error";
import UserDetail from "./UserDetail";

const statusColors = {
  "On sell": "#26a17b", // Green
  "Pending Approval": "#a0a0a0", // Grey
  "Sell completed": "#f59e0b", // Amber
};

// import your logo and statusColors accordingly

const AdminUserCard = ({ offer, sell, handleSubmit, setChange, handleUpdate }) => {
  const { allUser } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState(offer?.status);
  const [isViewing, setIsViewing] = useState(false);
  // Adjust isPending logic if needed
  const isPending = sell
    ? offer.status === "Pending Approval"
    : offer.status === "Waiting for uy";

  const timestamp = offer.createdAt;
  const dateObj = new Date(timestamp);

  const dateOnly = dateObj.toLocaleDateString("en-CA"); // YYYY-MM-DD

  const handleOnChange = (change) => {
    setChange(change);
    handleSubmit();
  };

  const statusColors = {
    inactive: "#26a17b", // Green
    active: "#a0a0a0", // Grey
  };

  return (
    <div
      className={`relative   shadow-sm
        ${isPending ? "opacity-90 filter grayscale" : ""}
      `}
    >
      <div className="flex flex-col sm:flex-row items-center justify-center bg-white rounded-lg py-2 px-4 sm:py-1 md:py-1 mb-4 border space-x-4 border-gray-200">
        <div className="flex-col md:flex-row md:flex-1 w-full sm:w-auto flex items-center mb-4 sm:mb-0 bg-slate-200 ">
          <div className="flex flex-col space-y-2 px-2 py-1 rounded-2xl">
            <span className="font-semibold text-xs sm:text-[16px]  text-gray-900 truncate">
              Nickname: <br /> {offer?.nickname}
            </span>
          </div>
        </div>
        <div className="flex-col md:flex-row md:flex-1 w-full sm:w-auto flex items-center mb-4 sm:mb-0">
          <div className="flex flex-col space-y-2">
            <span className="font-semibold text-xs sm:text-[16px]  text-gray-900 truncate">
              Phone: <br /> {offer?.phone}
            </span>
            {/* <span className="font-medium text-xs sm:text-[16px] text-gray-900 truncate">
            wallet address: {offer.tetherAddress}
          </span> */}
          </div>
        </div>

        {/* Center Right Section */}
        {/* <div className="flex-1 w-full sm:w-auto bg-slate-200  font-semibold text-gray-900 text-xs sm:text-[12px] mb-4 sm:mb-0 px-2 text-center sm:text-left truncat">
          Bank Account: <br /> {offer?.bankAccount} <br />
          Bank Name: <br /> {offer?.bankName}
        </div> */}

        <div className="flex flex-wrap flex-col space-x-8 space-y-3 items-center">
          <div className="space">
            <div className="text-xs mb-0 text-center font-semibold">double click</div>
            {/* Chat button for buy orders waiting for buy */}
            {offer.status === "active" ? (
              <button
                onClick={() => handleOnChange(false)}
                className="mt- px-2 py-2 cursor-pointer bg-[#26a17b] hover:bg-green-700 text-white rounded text-xs md:text-xs font-bold"
              >
                Set to Inactive
              </button>
            ) : (
              <button
                onClick={() => handleOnChange(true)}
                className="mt- px-2 py-2 cursor-pointer bg-[#e70d0d] hover:bg-red-700 text-white rounded text-xs md:text-xs font-bold"
              >
                set to active
              </button>
            )}
          </div>
        </div>
        <div className=" items-center">
          <button
            onClick={() => setIsViewing(!isViewing)}
            className="mt- px-2 py-2 cursor-pointer bg-[#26a17b] hover:bg-green-700 text-white rounded text-xs md:text-xs font-bold"
          >
            View Details
          </button>
        </div>

        {/* Right Section */}
        <div className="flex flex-col flex-wrap sm:flex-nowrap  w-full sm:w-32 items-center sm:items-end text-gray-800 text-xs space-y-1 relative">
          {/* <div className="break-words text-center sm:text-right w-full sm:w-auto truncate">
          {offer._id}
        </div> */}
          <div className="flex items-center  md:text-[16px] space-x-2">
            <div
              className="w-3 h-3 hidden sm:block rounded-full flex-shrink-0"
              // style={{ backgroundColor: statusColors[offer.status] || "#ccc" }}
            />
            <span
              className={`font-semibold select-none truncate max-w-[8rem] ${
                offer.status === "inactive" ? "text-red-600" : "text-lime-600"
              }`}
            >
              Status: <br /> {offer.status}
            </span>
          </div>
          <div className="text-center sm:text-right">{dateOnly}</div>
        </div>
      </div>
      {isViewing && <UserDetail user={offer} setIsViewing={setIsViewing} handleUpdate={handleUpdate} />}
    </div>
  );
};

export default AdminUserCard;
