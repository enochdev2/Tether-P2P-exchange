import React from "react";
import { Link } from "react-router-dom";

/**
 * Props:
 *  users: Array<{ id: string | number, name: string, status: "Active" | "Inactive" | string }>
 */
const UsersCard = ({ users, Icon }) => {
    return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold flex items-center space-x-3">
        {Icon && <Icon className="text-[#26a17b]" />}
        <span>Newly Registered User</span>
      </h2>

      <ul className="mt-4 space-y-2">
        {/* Header Row */}
        <li className="flex justify-between items-center bg-gray-100 px-2 rounded-lg py-2 font-semibold">
          <span className="text-lg">User Name</span>
          <span className="px-3 py-1">Status</span>
          <span>View Details</span>
        </li>

        {/* Users List */}
        {users.map(({ id, name, status }) => (
          <li
            key={id}
            className="flex justify-between items-center bg-gray-100 px-2 rounded-lg py-2"
          >
            <span className="text-lg font-semibold">{name}</span>

            <button
              type="button"
              className={`border px-3 py-1 rounded-xl cursor-pointer ${
                status.toLowerCase() === "active"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {status}
            </button>

            <Link
              to={`/admin/user/${id}`}
              className="text-white px-2 py-2 rounded-2xl font-semibold hover:bg-[#315c4eee] bg-[#26a17b]"
            >
              View Details
            </Link>
          </li>
        ))}
      </ul>

      <Link to="/admin/users" className="text-blue-600 hover:underline mt-4 inline-block">
        Manage Users
      </Link>
    </div>
  );
};

export default UsersCard;
