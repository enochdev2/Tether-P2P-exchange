import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserDetail from "../../components/UserDetail";

const transactionsData = {
  1: [
    {
      id: "TX12345",
      amount: "350 USDT",
      status: "Completed",
      date: "2025-05-09",
    },
    {
      id: "TX12346",
      amount: "500,000 KRW",
      status: "Pending",
      date: "2025-05-08",
    },
  ],
  2: [
    {
      id: "TX22345",
      amount: "1000 USDT",
      status: "Completed",
      date: "2025-05-07",
    },
  ],
};

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  console.log("🚀 ~ UserDetails ~ userId:", userId);
  const [users, setUsers] = useState();
  const user = users?.find((u) => u._id === userId);
  const transactions = transactionsData[userId] || [];

  // const [users, setUser] = useState(initialUser || initialUser);
    const [isSaving, setIsSaving] = useState(false);
  
    if (!user) {
      return <div className="p-8 text-center text-gray-600">No user data available.</div>;
    }
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setUsers((prev) => ({ ...prev, [name]: value }));
    };
  
  //  useEffect(() => {
  //     setUser(initialUser || {});
  //   }, [initialUser]);
    
  
    const handleSave = () => {
      setIsSaving(true);
  
      // TODO: Call API to save updated user profile here
      setTimeout(() => {
        setIsSaving(false);
        alert("User profile saved successfully!");
      }, 1500);
    };

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
        setUsers(data); // return parsed user data
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    allUser();
  }, [navigate]);

  return (
    <div className="bg-gray-50 pt-20 p-8 font-sans max-w-5xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900">
        User Details{" "}
        <span className="text-[#26a17b]">(User ID: {user.id || user._id})</span>
      </h1>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Edit User Profile
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {[
            { label: "Username", name: "username", type: "text" },
            { label: "Nickname", name: "nickname", type: "text" },
            { label: "Full Name", name: "fullName", type: "text" },
            { label: "Phone", name: "phone", type: "tel" },
            { label: "Date of Birth", name: "dob", type: "date" },
            { label: "Bank Name", name: "bankName", type: "text" },
            { label: "Bank Account", name: "bankAccount", type: "text" },
            { label: "Tether Address", name: "tetherAddress", type: "text" },
            {
              label: "Status",
              name: "status",
              type: "select",
              options: [
                { label: "Active", value: true },
                { label: "Inactive", value: false },
              ],
            },
          ].map(({ label, name, type, options }) => (
            <div key={name} className="flex flex-col">
              <label
                htmlFor={name}
                className="mb-2 font-medium text-gray-700 select-none"
              >
                {label}
              </label>

              {type === "select" ? (
                <select
                  id={name}
                  name={name}
                  value={user[name] || ""}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="" disabled>
                    Select status
                  </option>
                  {options.map(({ label: optLabel, value }) => (
                    <option key={String(value)} value={String(value)}>
                      {optLabel}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={name}
                  name={name}
                  type={type}
                  value={user[name] || ""}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              )}
            </div>
          ))}

          <div className="md:col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              disabled={isSaving}
              className={`inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-6 py-3 text-white font-semibold shadow-md transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg mt-10 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Transaction History
        </h2>

        {transactions && transactions.length > 0 ? (
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border-b text-left font-medium text-gray-700">
                  Transaction ID
                </th>
                <th className="px-4 py-2 border-b text-left font-medium text-gray-700">
                  Amount
                </th>
                <th className="px-4 py-2 border-b text-left font-medium text-gray-700">
                  Status
                </th>
                <th className="px-4 py-2 border-b text-left font-medium text-gray-700">
                  Date
                </th>
                <th className="px-4 py-2 border-b text-left font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(({ id, amount, status, date }) => (
                <tr
                  key={id}
                  className="hover:bg-indigo-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-2 border-b">{id}</td>
                  <td className="px-4 py-2 border-b">{amount}</td>
                  <td
                    className={`px-4 py-2 border-b font-semibold ${
                      status.toLowerCase() === "completed"
                        ? "text-green-600"
                        : status.toLowerCase() === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {status}
                  </td>
                  <td className="px-4 py-2 border-b">{date}</td>
                  <td className="px-4 py-2 border-b">
                    <button className="text-indigo-600 hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600 italic">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
