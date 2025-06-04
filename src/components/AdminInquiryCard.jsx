import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";
import { SuccessToast } from "../utils/Success";
import { ErrorToast } from "../utils/Error";

const AdminInquiryCard = ({ offer, sell, handleSubmit, setChange }) => {
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
      }else{
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
    <div
      className={`relative flex flex-col sm:flex-row sm:space-x-1 items-center bg-white rounded-lg py-2 px-4 sm:py-1 md:py-1 mb-4 border border-gray-200 shadow-sm
        ${isPending ? "opacity-90 filter grayscale" : ""}
      `}
    >
      {/* Center Left Section */}
      <div className="flex-col md:flex-row md:flex- w-full sm:w-auto flex items-center mb-4 sm:mb-0">
        <div className="flex flex-col space-y-2 ..bg-slate-200 px-4 py-1 rounded-2xl">
          <span className="font-semibold text-xs sm:text-[16px] text-gray-900 truncate">
            {offer?.title}
          </span>
        </div>
      </div>
      <div className="flex-col md:flex-row md:flex-1 w-full sm:w-auto flex items-center mb-4 sm:mb-0">
        <div className="flex flex-col space-y-2">
          <span className="font-semibold text-xs sm:text-[16px] text-gray-900 truncate">
            {offer?.userId?.username}
          </span>
        </div>
      </div>

      {/* Center Right Section */}
      <div className="flex-1 w-full sm:w-auto font-semibold text-gray-900 text-xs sm:text-[12px] mb-4 sm:mb-0 text-center sm:text-left truncat">
        <br /> {offer?.description} <br />
      </div>

      {/* Center Right Section */}
      <div className="flex-1 w-full sm:w-auto font-semibold text-gray-900 text-xs sm:text-[12px] mb-4 sm:mb-0 text-center sm:text-left truncat">
        <br /> {offer?.comment ? offer?.comment : "No comment added yet"} <br />
      </div>

      {/* Add Comment Button */}
      <div className="flex flex-wrap flex-col space-x-5 space-y-3 items-center">
        <div>
          <button
            onClick={() => setIsCommenting(!isCommenting)}
            className="mt-2 px-3 py-2 cursor-pointer bg-[#26a17b] hover:bg-green-700 text-white rounded text-xs md:text-sm font-bold"
          >
            {isCommenting ? "Cancel" : "Add Comment"}
          </button>
        </div>

        {/* Dropdown to input and submit comment */}
        {isCommenting && (
          <div className="mt-2 w-full max-w-xs">
            <textarea
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter your comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              onClick={() => handleCommentSubmit(offer._id)}
              disabled={loading}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              {loading ? "Submitting..." : "Submit Comment"}
            </button>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex flex-col flex-wrap sm:flex-nowrap flex-1 w-full sm:w-32 items-center sm:items-end text-gray-800 text-xs space-y-0 relative">
        <div className="break-words text-center sm:text-right w-full sm:w-auto truncate">
          {offer._id.slice(0, 5)}
        </div>
        <div className="flex items-center md:text-[15px] space-x-2">
          <div className="w-3 h-3 hidden sm:block rounded-full flex-shrink-0" />
          <span
            className={`font-semibold select-none truncate max-w-[8rem] ${
              offer.status === "inactive" ? "text-red-600" : "text-lime-600"
            }`}
          >
            {offer.status}
          </span>
        </div>
        <div className="text-center sm:text-right">{dateOnly}</div>
      </div>
    </div>
  );
};

export default AdminInquiryCard;
