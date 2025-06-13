import { useState } from "react";
import UserDetail from "./UserDetail";
import { useTranslation } from "react-i18next";

const AdminUserCard = ({ users, handleStatusChange, handleUpdate }) => {
  const { t } = useTranslation();
  const [viewingUsers, setViewingUsers] = useState({});

  const toggleViewDetails = (userId) => {
    setViewingUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto w-full rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-[600px] w-full table-auto text-left text-sm text-gray-800">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="px-4 py-3">{t("usermanagement.nickname")}</th>
              <th className="px-4 py-3">{t("usermanagement.phone")}</th>
              <th className="px-4 py-3 text-center">{t("usermanagement.statusToggle")}</th>
              <th className="px-4 py-3 text-center">View Details</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const dateObj = new Date(user.createdAt);
              const dateOnly = dateObj.toLocaleDateString("en-CA");

              return (
                <tr key={user._id} className="border-b border-gray-200">
                  {/* Nickname */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="truncate block max-w-xs">{user?.nickname}</span>
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="truncate block max-w-xs">{user?.phone}</span>
                  </td>

                  {/* Status Toggle */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center space-y-1">
                      {user.status === "active" ? (
                        <button
                          onClick={() => handleStatusChange(user, false)}
                          className="px-3 lg:py-3 cursor-pointer py-1 bg-[#26a17b] hover:bg-green-700 text-white rounded text-xs font-semibold"
                        >
                          {t("usermanagement.setToInactive")}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(user, true)}
                          className="px-3 py-1 lg:py-3 cursor-pointer bg-[#e70d0d] hover:bg-red-700 text-white rounded text-xs font-semibold"
                        >
                          {t("usermanagement.setToActive")}
                        </button>
                      )}
                    </div>
                  </td>

                  {/* View Details */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleViewDetails(user._id)}
                      className="px-3 py-1 lg:py-3 cursor-pointer bg-[#26a17b] hover:bg-green-700 text-white rounded text-xs font-semibold"
                    >
                      {viewingUsers[user._id] ? "Hide Details" : "View Details"}
                    </button>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`font-semibold ${
                        user.status === "inactive" ? "text-red-600" : "text-lime-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 whitespace-nowrap text-center">{dateOnly}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Render UserDetail modals for each user that's being viewed */}
      {users.map(
        (user) =>
          viewingUsers[user._id] && (
            <UserDetail
              key={`detail-${user._id}`}
              user={user}
              setIsViewing={() => toggleViewDetails(user._id)}
              handleUpdate={handleUpdate}
            />
          )
      )}
    </div>
  );
};

export default AdminUserCard;