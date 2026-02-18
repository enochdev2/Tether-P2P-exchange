import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Bankend_Url } from "../../utils/AuthProvider";
import { ErrorToast } from "../../utils/Error";

const AllUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const allUser = async () => {
      try {
        const response = await fetch(`${Bankend_Url}/api/v1/user/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

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

        const data = await response.json();
        setAllUsers(data); // return parsed user data
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    allUser();
  }, []);

  // const getAllUsers = async () => {
  //   try {
  //     const response = await allUser();

  //     if (response) {
  //       setAllUsers(response);
  //     } else {
  //       return;
  //     }
  //   } catch (error) {
  //     console.error("Error during sign-up:", error);
  //   } finally {
  //     setIsLoading(false); // Hide loading state after completion
  //   }
  // };

  const handleViewUser = (userId) => {
    // Navigate to user detail page (adjust route as needed)
    navigate(`/adnin/users/${userId}`);
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
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900 tracking-tight">All Users</h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead
            className="bg-gradient-to-r from-green-400 via-green-500 to-green-700
 text-white"
          >
            <tr>
              <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">
                User ID
              </th>
              <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">
                Full Name
              </th>
              <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">Phone</th>
              <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-center font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {allUsers?.map((user, idx) => (
              <tr
                key={user.id}
                className={`cursor-pointer hover:bg-indigo-50 transition-colors ${
                  idx % 2 === 0 ? "bg-white" : "bg-indigo-50/50"
                }`}
                onClick={() => handleViewUser(user.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">{idx}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{user.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{user.phone || "-"}</td>
                <td
                  className={`px-6 py-4 whitespace-nowrap font-semibold ${
                    user.status?.toLowerCase() === "active"
                      ? "text-green-600"
                      : user.status?.toLowerCase() === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {user.status || "Unknown"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent row click
                      handleViewUser(user._id);
                    }}
                    className="px-3 py-1 bg-[#26a17b] text-white rounded-md hover:bg-emerald-800 cursor-pointer transition"
                    aria-label={`View details of ${user.username}`}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Outlet />
    </div>
  );
};

export default AllUsers;
