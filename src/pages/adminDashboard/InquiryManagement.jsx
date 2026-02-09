import { useEffect, useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import AdminInquiryCard from "../../components/AdminInquiryCard";
import LoadingSpiner from "../../components/LoadingSpiner";
import NotificationPopup from "../../components/NotificationPopup";
import { ErrorToast } from "../../utils/Error";
import { SuccessToast } from "../../utils/Success";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const InquiryManagement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loadingSell, setLoadingSell] = useState(true);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    allUser();
  }, []);

  const allUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://tether-p2-p-exchang-backend.vercel.app/api/v1/inquiry/all/active",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const data = await response.json();
        const errorMsg = data.error || data.message || "Failed to register user";
        if (errorMsg === "Invalid or expired token") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("isLoggedIn");
          navigate("/signin");
        }
        ErrorToast(errorMsg);
      }

      setAllUsers(data); // return parsed user data
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingSell(false);
    }
  };

  const sortedOffers = allUsers.sort((a, b) => {
    // First, prioritize posts without comments
    if (!a.comment && b.comment) return -1; // a should come first if a doesn't have a comment
    if (a.comment && !b.comment) return 1; // b should come first if b doesn't have a comment

    // If both have comments or both don't have comments, sort by creation date (oldest first)
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  if (loadingSell) return <LoadingSpiner />;

  const Sell = true;

  return (
    <div>
      <div className="flex bg-gray-50 pt-2 min-h-screen">
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 bg-slate-50 border border-slate-300 px-6 py-5 rounded-2xl shadow-md">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-br from-green-600 via-[#26a17b] to-green-800 text-transparent bg-clip-text flex items-center">
              <FaQuestionCircle className="text-green-600 mr-3 text-xl sm:text-2xl md:text-3xl" />
              {t("inquirys.allInquiriesManagement")}
            </h1>
          </div>

          {/* Section Title */}
          <div className="mb-5">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">
              {t("inquirys.allInquiries")}
            </h2>

            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-6 gap-4 text-white bg-[#26a17b] px-5 py-3 rounded-md text-sm font-semibold">
              <div> {t("inquirys.titles")}</div>
              <div>{t("profile.nickname")}</div>
              <div> {t("inquirys.description")}</div>
              <div>{t("inquirys.status")}</div>
              <div>Action</div>
              <div>{t("inquirys.date")}</div>
            </div>

            {/* Render Data */}
            {allUsers?.length === 0 ? (
              <p className="text-gray-500 mt-4">No User Available.</p>
            ) : (
              sortedOffers?.map((offer) => (
                <AdminInquiryCard
                  key={offer._id}
                  offer={offer}
                  sell={Sell}
                  showChatButton={offer.status === "On Sale"}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryManagement;
