import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bankend_Url, useAuth } from "../utils/AuthProvider";
import { ErrorToast } from "../utils/Error";
import { SuccessToast } from "../utils/Success";

const UserDetail = ({ user: initialUser, setIsViewing, handleUpdate }) => {
  const { t } = useTranslation();
  const { updateUser } = useAuth();
  // const user = initialUser
  const [user, setUsers] = useState(initialUser || initialUser);
  console.log("🚀 ~ UserDetail ~ user:", user);

  const [phone, setPhone] = useState(user?.phone);
  const [username, setUsername] = useState(user?.username);
  const [referralCode, setReferralCode] = useState(user?.referralCode);
  const [nickname, setNickname] = useState(user?.nickname);
  const [password, setPassword] = useState(user?.password);
  const [fullName, setFullName] = useState(user?.fullName);
  const [dob, setDob] = useState(user?.dob);
  const [bankName, setBankName] = useState(user?.bankName);
  const [telegram] = useState(user?.telegram);
  const [bankAccount, setBankAccount] = useState(user?.bankAccount);
  const [tetherAddress, setTetherAddress] = useState(user?.tetherAddress);
  const [status, setStatus] = useState(user?.status || "inactive");
  const [isSaving, setIsSaving] = useState(false);
  const [rawFile, setRawFile] = useState(null);

  useEffect(() => {
    setUsers(initialUser || {});
  }, [initialUser]);

  if (!user) {
    return <div className="p-8 text-center text-gray-600">No user data available.</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update user object state
    setUsers((prev) => ({ ...prev, [name]: value }));

    // Update individual field states
    switch (name) {
      case "phone":
        setPhone(value);
        break;
      case "username":
        setUsername(value);
        break;
      case "nickname":
        setNickname(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "fullName":
        setFullName(value);
        break;
      case "dob":
        setDob(value);
        break;
      case "bankName":
        setBankName(value);
        break;
      case "bankAccount":
        setBankAccount(value);
        break;
      case "referralCode":
        setReferralCode(value);
        break;
      case "tetherAddress":
        setTetherAddress(value);
        break;
      case "status":
        setStatus(value); // Convert string to boolean
        break;
      default:
        break;
    }
  };

  const handleSave = async () => {
    // e.preventDefault();

    setIsSaving(true);

    const updatedUser = {
      phone,
      username,
      nickname,
      fullName,
      dob,
      bankName,
      telegram,
      bankAccount: Number(bankAccount),
      tetherAddress,
      status,
      referralCode,
      admin: user?.admin || false, // preserve existing admin status
    };

    try {
      const response = await updateUser(updatedUser);
      if (response.nickname) {
        await handleUpdate();
        SuccessToast(t("messages.dataUpdated"));
        setIsSaving(false);
        setPhone(phone);
        setUsername(username);
        setNickname(nickname);
        setFullName(fullName);
        setDob(dob);
        setBankName(bankName);
        setBankAccount(bankAccount);
        setTetherAddress(tetherAddress);
        setStatus(status);
        setReferralCode(referralCode);
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      ErrorToast(`something went wrong ${error}`);
    } finally {
      setIsSaving(false);
      setIsViewing(false);
    }
  };

  const updateImage = async (userId) => {
    if (!rawFile) return ErrorToast("Please select an image to upload.");

    const formData = new FormData();
    formData.append("file", rawFile);

    const res = await fetch(`${Bankend_Url}/api/v1/user/${userId}/image`, {
      method: "PUT",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setUsers((prev) => ({
        ...prev,
        tetherIdImage: data.imageUrl,
      }));
      SuccessToast("Image updated successfully!");
    } else {
      console.error("Image update failed:", data.message);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6 sm:p-8 font-sans max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 text-gray-900">
        User Details : <span className="text-[#26a17b]">{user.nickname || user._id}</span>
      </h1>

      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-green-600 bg-slate-100 px-3 py-2 shadow-sm rounded">
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
            { label: "Password", name: "password", type: "text" },
            { label: "Full Name", name: "fullName", type: "text" },
            { label: "Phone", name: "phone", type: "tel" },
            { label: "Date of Birth", name: "dob", type: "date" },
            { label: "Bank Name", name: "bankName", type: "text" },
            { label: "Bank Account", name: "bankAccount", type: "text" },
            { label: "Telegram ID", name: "telegram", type: "text" },
            { label: "Tether Address", name: "tetherAddress", type: "text" },
            { label: "Referral Code", name: "referralCode", type: "text" },
            {
              label: "Status",
              name: "status",
              type: "select",
              options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ],
            },
          ].map(({ label, name, type, options }) => (
            <div key={name} className="flex flex-col">
              <label
                htmlFor={name}
                className="mb-2 font-medium text-gray-700 select-none text-sm sm:text-base"
              >
                {label}
              </label>

              {type === "select" ? (
                <select
                  id={name}
                  name={name}
                  value={status}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                  value={
                    name === "phone"
                      ? phone
                      : name === "username"
                        ? username
                        : name === "nickname"
                          ? nickname
                          : name === "password"
                            ? password
                            : name === "fullName"
                              ? fullName
                              : name === "dob"
                                ? dob
                                : name === "referralCode"
                                  ? referralCode
                                  : name === "bankName"
                                    ? bankName
                                    : name === "bankAccount"
                                      ? bankAccount
                                      : name === "telegram"
                                        ? telegram
                                        : name === "tetherAddress"
                                          ? tetherAddress
                                          : name === "status"
                                            ? status
                                            : ""
                  }
                  onChange={handleChange}
                  disabled={
                    name === "nickname" ||
                    name === "username" ||
                    name === "fullName" ||
                    name === "dob"
                  }
                  className={`border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
                    name === "username" ||
                    name === "nickname" ||
                    name === "fullName" ||
                    name === "dob"
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "focus:ring-indigo-500 focus:border-indigo-500"
                  }`}
                />
              )}
            </div>
          ))}
          {/* Avatar Display Section */}
          <div className="w- h-40 rounded- overflow-hidden border-4 border-green-500 shadow-md">
            <img
              src={user?.tetherIdImage || "https://i.pravatar.cc/150?img=43"} // Replace with user.avatar later
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="mb-2 font-medium text-gray-700 text-sm sm:text-base">
              Update the ID Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setRawFile(file);
                  setUsers((prev) => ({
                    ...prev,
                    tetherIdImage: URL.createObjectURL(file),
                  }));
                }
              }}
              className="block w-full text-sm text-gray-500
    file:mr-4 file:py-2 file:px-4
    file:rounded-full file:border-0
    file:text-sm file:font-semibold
    file:bg-green-50 file:text-green-700
    hover:file:bg-green-100
    "
            />
            <button
              type="button"
              onClick={() => updateImage(user._id)}
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition duration-200"
            >
              Upload Image
            </button>
          </div>

          <div className="md:col-span-2 flex justify-center md:justify-end ">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-8 py-3 text-white font-semibold shadow-md transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
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
    </div>
  );
};

export default UserDetail;
