import { CommandIcon, InfoIcon, MessageCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import LoadingSpiner from "../../components/LoadingSpiner";
import { useAuth } from "../../utils/AuthProvider";
import NotificationPopup from "../../components/NotificationPopup";
import { useTranslation } from "react-i18next";
import { FaEdit, FaTrash } from "react-icons/fa";
import ConfirmModal from "../../components/ConfirmModal";
import { ErrorToast } from "../../utils/Error";

// const inquiries = [
//   {
//     title: "Edit Account Info",
//     username: "user",
//     description: "I need ...",
//     conmment: "",
//     date: "2025-05-20",
//   },
//   {
//     title: "Other inquiries",
//     username: "user",
//     description: "Help...",
//     comment: <MessageCircle size={18} />,
//     date: "2025-04-13",
//   },
//   {
//     title: "Inquiries about Buy",
//     username: "user",
//     description: "Help...",
//     comment: <MessageCircle size={18} />,
//     date: "2025-03-13",
//   },
// ];

// Sort inquiries by date descending;

export default function InquiryHistory() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LoadingSpiner />;

  return (
    <div className="bg-gray-100 h-auto w-full flex flex-col items-center pt-10 font-sans">
      <AllInquiries />
    </div>
  );
}

const AllInquiries = () => {
  const { t } = useTranslation();
  const [allInquiry, setAllInquiry] = useState([]);
  // const { allUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const navigate = useNavigate();

  const allUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/inquiry/user",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        const data = await response.json();
        const errorMsg = data.error || data.message || "Failed to register user";
        ErrorToast(errorMsg);
      }

      const data = await response.json();

      setAllInquiry(data); // return parsed user data
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewUser = () => {
    // Navigate to user detail page (adjust route as needed)
    // navigate(`/`);
  };

  useEffect(() => {
    allUsers();
  }, []);

  if (!isLoading && allInquiry.length === 0) {
    return (
      <div className=" flex items-center justify-center p-8 bg-gray-50">
        <p className="text-gray-500 text-lg">No new inquiry made yet</p>
      </div>
    );
  }

  const modalDelete = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:px-8 sm:py-2">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-gray-900 tracking-tight">
        {t("inquirys.allInquiries")}
      </h1>

      {/* Desktop Table: visible from md and up */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full table-auto border-collapse text-xs md:text-sm">
          <thead className="bg-[#26a17b] text-white">
            <tr>
              <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider">
                {t("inquirys.titles")}
              </th>
              <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider">
                {t("inquirys.description")}
              </th>
              <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider">
                {t("inquirys.comment")}
              </th>
              <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider">
                {t("inquirys.status")}
              </th>
              <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider">
                {t("inquirys.date")}
              </th>
              <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {allInquiry?.map((user, idx) => (
              <tr
                key={user.id}
                className={`cursor-pointer border-b border-gray-400 hover:bg-green-100 transition-colors ${
                  idx % 2 === 0 ? "bg-white" : "bg-indigo-50/50"
                }`}
                onClick={() => handleViewUser(user.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                  {user.title === "Edit Account Info" && t("inquirys.editAccount")}
                  {user.title === "Sell Inquiry" && t("inquirys.sellInquiry")}
                  {user.title === "Buy Inquiry" && t("inquirys.buyInquiry")}
                  {user.title === "Other Inquiry" && t("inquirys.otherInquiry")}
                </td>
                <td className="px-6 py-4 text-gray-700 bg-slate-100 max-w-sm break-words">
                  {user.description}
                </td>
                <td className="px-6 py-4 text-gray-700 max-w-sm break-words">
                  {user?.comment || t("inquirys.noComment")}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap bg-slate-100 font-semibold ${
                    user.status?.toLowerCase() === "active"
                      ? "text-green-600"
                      : user.status?.toLowerCase() === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {user.status === "Pending" && t("inquirys.status")}
                </td>
                <td className="px-3 text-xs py-4 whitespace-nowrap text-gray-700">
                  {formatDateTime(user.date) || "Unknown"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  <div className="flex items-center gap-3">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </button>
                    <button onClick={modalDelete} className="text-red-600 hover:text-red-800">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card/List view: visible only below md */}
      <div className="md:hidden space-y-4">
        {allInquiry?.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-lg shadow p-4 cursor-pointer hover:bg-indigo-50 transition"
            onClick={() => handleViewUser(user.id)}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{user.title}</h2>
            <p className="text-sm text-gray-700 mb-1">
              <span className="font-semibold">Description:</span> {user.description}
            </p>
            <p className="text-sm text-gray-600 mb-1 truncate">
              <span className="font-semibold">Comment:</span> {user.comment || "No comment yet"}
            </p>
            <p
              className={`text-sm font-semibold mb-1 ${
                user.status?.toLowerCase() === "active"
                  ? "text-green-600"
                  : user.status?.toLowerCase() === "pending"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              Status: {user.status}
            </p>
            <p className="text-sm text-gray-600">Date: {user.date || "Unknown"}</p>

            {/* Actions */}
            <div className="mt-3 flex items-center gap-4">
              <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                <FaEdit />
                <span>Edit</span>
              </button>
              <button
                onClick={modalDelete}
                className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
              >
                <FaTrash />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        // onConfirm={() => handleCancleMatch(pendingOrderId)}
        message="Are you sure to the delete"
      />
    </div>
  );
};

function formatDateTime(timestamp) {
  if (!timestamp) return "Unknown";

  const dateObj = new Date(timestamp);

  // Format date as YYYY-MM-DD
  const dateOnly = dateObj.toLocaleDateString("en-CA");

  // Format time as HH:mm:ss (24-hour)
  const timeOnly = dateObj.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // return `${dateOnly} ${timeOnly}`;
  return `${dateOnly}`;
}
