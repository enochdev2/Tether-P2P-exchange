import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";
import { SuccessToast } from "../utils/Success";
import { ErrorToast } from "../utils/Error";
import { useTranslation } from "react-i18next";

const AdminInquiryCard = ({ offer, sell, handleSubmit, setChange }) => {
  const { t } = useTranslation();
  const { allUser } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState(offer?.status);
  const [isCommenting, setIsCommenting] = useState(false); // Track comment form visibility
  const [commentText, setCommentText] = useState(""); // To store comment input
  const [loading, setLoading] = useState(false);

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

  const handleCommentSubmit = async (inquiryId) => {
    if (!commentText.trim()) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://tether-p2p-exchang-backend.onrender.com/api/v1/inquiry/${inquiryId}/comment`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: commentText,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMsg =
          data.error || data.message || "Failed to register user";
        ErrorToast(errorMsg);
      } else {
        SuccessToast("Comment successfully added!");
        setIsCommenting(false);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative rounded-lg py-3 px-4 mb-4 border border-gray-200 shadow-sm bg-white">
  <div className="flex flex-col sm:grid sm:grid-cols-6 gap-4 items-start sm:items-center">
    {/* Title */}
    <div className="font-medium text-sm sm:text-[15px] text-gray-900 truncate">
    {offer?.title}
    {offer.title === "Edit Account Info" && t("inquirys.editAccount")}
                  {offer.title === "Sell Inquiry" && t("inquirys.sellInquiry")}
                  {offer.title === "Buy Inquiry" && t("inquirys.buyInquiry")}
                  {offer.title === "Other Inquiry" && t("inquirys.otherInquiry")}
    </div>
    

    {/* Nickname */}
    <div className="font-medium text-sm sm:text-[15px] text-gray-900 truncate">{offer?.userId?.username}</div>

    {/* Description */}
    <div className="text-xs sm:text-sm text-gray-700 break-words">{offer?.description}</div>

    {/* Comment */}
    <div className="text-xs sm:text-sm text-gray-700 break-words">
      {offer?.comment || t("inquirys.noComment")}
    </div>

    {/* Action */}
    <div className="flex flex-col items-start">
      <button
        onClick={() => setIsCommenting(!isCommenting)}
        className="px-3 py-2 bg-[#26a17b] hover:bg-green-700 text-white text-xs md:text-sm rounded font-semibold"
      >
        {isCommenting ? "Cancel" : "Add Comment"}
      </button>
    </div>

    {/* Status and Date */}
    <div className="flex flex-col items-start sm:items-end text-xs sm:text-sm text-gray-800">
      <span className="truncate w-full sm:w-auto">{offer._id.slice(0, 10)}</span>
      <span
        className={`font-semibold mt-1 ${
          offer.status === "inactive" ? "text-red-600" : "text-lime-600"
        }`}
      >
        {offer.status}
      </span>
      <span className="mt-1">{dateOnly}</span>
    </div>
  </div>

  {/* Comment Input */}
  {isCommenting && (
  <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
    <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
      <textarea
        className="w-full md:w-[65%] h-24 p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#26a17b]"
        placeholder="Write your comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />
      <button
        onClick={() => handleCommentSubmit(offer._id)}
        disabled={loading}
        className="w-full md:w-auto px-5 py-3 text-sm font-semibold rounded-lg bg-[#26a17b] hover:bg-green-700 text-white transition duration-200"
      >
        {loading ? "Submitting..." : "Submit Comment"}
      </button>
    </div>
  </div>
)}

</div>

  );
};

export default AdminInquiryCard;
