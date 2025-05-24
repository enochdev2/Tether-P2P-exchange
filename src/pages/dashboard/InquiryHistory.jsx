import { CommandIcon, InfoIcon, MessageCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import LoadingSpiner from "../../components/LoadingSpiner";
import { useAuth } from "../../utils/AuthProvider";

const inquiries = [
  {
    title: "Edit Account Info",
    username: "user",
    description: "I need ...",
    conmment: "",
    date: "2025-05-20",
  },
  {
    title: "Other inquiries",
    username: "user",
    description: "Help...",
    comment: <MessageCircle size={18} />,
    date: "2025-04-13",
  },
  {
    title: "Inquiries about Buy",
    username: "user",
    description: "Help...",
    comment: <MessageCircle size={18} />,
    date: "2025-03-13",
  },
];

// Sort inquiries by date descending
const sortedInquiries = inquiries.sort(
  (a, b) => new Date(b.date) - new Date(a.date)
);

export default function InquiryHistory() {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

   if (isLoading) return <LoadingSpiner />;

  return (
    <div className="bg-gray-100 h-auto w-full flex flex-col items-center pt-10 font-sans">
      <AllInquiries/>
      {/* Card container */}
      <div className="bg-white rounded-md shadow-md sm:w-[420px] md:w-4xl mx-auto py-5">
        {/* Header */}
        <div className="flex justify-center py-2 border border-gray-400 rounded-t-md bg-gray-200 mx-20 cursor-default select-none mb-4">
          <button className="text-gray-700 text-sm font-semibold rounded px-3 py-1">
            Inquiry History
          </button>
        </div>

        {/* Inquiry list */}
        <div className="divide-y divide-gray-300">
          {sortedInquiries.map(({ title, description, date, comment }, idx) => (
            <div
              key={idx}
              className="flex items-center  px-4 py-3 hover:bg-gray-50 cursor-default"
            >
              {/* Title */}
              <div className="flex-1 text-sm text-gray-800 truncate">
                {title}
              </div>

              {/* Separator */}
              <div className="w-2 h-9 bg-gray-300 mx-2"></div>

              {/* Description */}
              <div className="flex-1 flex text-sm text-gray-600 truncate">
                {description}
                {comment}
              </div>
              {/* Info icon (circle with small dash) */}
              <div
                className=" flex-1 space-x-3 mx-2 flex select-none cursor-pointer"
                title="More info"
              ></div>

              {/* Date */}
              <div className="text-xs text-gray-700 w-24 text-right select-none">
                {date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}




const AllInquiries = () => {
  const [allUsers, setAllUsers] = useState([]);
  const { allUser } = useAuth();
  // const navigate = useNavigate();

  useEffect(() => {
    const allUser = async () => {
      try {
        const response = await fetch(
          "https://tether-p2p-exchang-backend.onrender.com/api/v1/user/users",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        console.log("Users fetched successfully 12345667", data);
        setAllUsers(data); // return parsed user data
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    allUser()
  }, []);

  const getAllUsers = async () => {
    try {
      const response = await allUser();

      if (response) {
        setAllUsers(response);
      } else {
        return;
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
    } finally {
      setIsLoading(false); // Hide loading state after completion
    }
  };

  const handleViewUser = (userId) => {
    // Navigate to user detail page (adjust route as needed)
    // navigate(`/`);
  };

  if (!allUsers || allUsers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
        <p className="text-gray-500 text-lg">No users found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900 tracking-tight">
        All Inquiries
      </h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gradient-to-r from-green-400 via-green-500 to-green-700
 text-white">
            <tr>
              <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">
                Comment
              </th>
              <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {inquiries?.map((user, idx) => (
              <tr
                key={user.id}
                className={`cursor-pointer hover:bg-indigo-50 transition-colors ${
                  idx % 2 === 0 ? "bg-white" : "bg-indigo-50/50"
                }`}
                onClick={() => handleViewUser(user.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                  {user.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {user?.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {user?.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {user.comment || "-"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap font-semibold ${
                    user.status?.toLowerCase() === "active"
                      ? "text-green-600"
                      : user.status?.toLowerCase() === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {user.date || "Unknown"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* <Outlet/> */}
    </div>
  );
};

