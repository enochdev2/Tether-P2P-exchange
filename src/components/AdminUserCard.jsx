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

const AdminUserCard = ({
  offer,
  sell,
  handleSubmit,
  setChange,
  handleUpdate,
}) => {
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
      className={`relative shadow-sm ${
        isPending ? "opacity-90 filter grayscale" : ""
      }`}
    >
      <div className="overflow-x-auto w-full rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-[600px] w-full table-auto text-left text-sm text-gray-800">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="px-4 py-3">Nickname</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3 text-center">Status Toggle</th>
              <th className="px-4 py-3 text-center">View Details</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {/* Nickname */}
              <td className="border-b border-gray-200 px-4 py-3 whitespace-nowrap">
                {/* <span className="font-semibold">Nickname:</span> <br /> */}
                <span className="truncate block max-w-xs">
                  {offer?.nickname}
                </span>
              </td>

              {/* Phone */}
              <td className="border-b border-gray-200 px-4 py-3 whitespace-nowrap">
                {/* <span className="font-semibold">Phone:</span> <br /> */}
                <span className="truncate block max-w-xs">{offer?.phone}</span>
              </td>

              {/* Status Toggle */}
              <td className="border-b border-gray-200 px-4 py-3 text-center">
                <div className="flex flex-col items-center space-y-1">
                  {/* <span className="text-xs font-semibold">Double click</span> */}
                  {offer.status === "active" ? (
                    <button
                      onClick={() => handleOnChange(false)}
                      className="px-3 lg:py-3 cursor-pointer py-1 bg-[#26a17b] hover:bg-green-700 text-white rounded text-xs font-semibold"
                    >
                      Set to Inactive
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOnChange(true)}
                      className="px-3 py-1 lg:py-3 cursor-pointer bg-[#e70d0d] hover:bg-red-700 text-white rounded text-xs font-semibold"
                    >
                      Set to Active
                    </button>
                  )}
                </div>
              </td>

              {/* View Details */}
              <td className="border-b border-gray-200 px-4 py-3 text-center">
                <button
                  onClick={() => setIsViewing(!isViewing)}
                  className="px-3 py-1 lg:py-3 cursor-pointer bg-[#26a17b] hover:bg-green-700 text-white rounded text-xs font-semibold"
                >
                  View Details
                </button>
              </td>

              {/* Status */}
              <td className="border-b border-gray-200 px-4 py-3 whitespace-nowrap">
                <span
                  className={`font-semibold ${
                    offer.status === "inactive"
                      ? "text-red-600"
                      : "text-lime-600"
                  }`}
                >
                  {offer.status}
                </span>
              </td>

              {/* Date */}
              <td className="border-b border-gray-200 px-4 py-3 whitespace-nowrap text-center">
                {dateOnly}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {isViewing && (
        <UserDetail
          user={offer}
          setIsViewing={setIsViewing}
          handleUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default AdminUserCard;
