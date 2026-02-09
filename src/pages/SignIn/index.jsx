import React, { useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthProvider";
import { SuccessToast } from "../../utils/Success";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ErrorToast } from "../../utils/Error";
import { useTranslation } from "react-i18next";
import ForgotNicknameModal from "../../components/ForgotNicknameModal ";
const SignIn = () => {
  const { t } = useTranslation();
  const { setIsLoggedIn, setUser } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    nickname: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [forgotType, setForgotType] = useState();

  const modalOpen = (type) => {
    setForgotType(type);
    setIsNicknameModalOpen(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loading state

    // Create the new user data
    const user = {
      ...credentials,
    };

    try {
      // const data = await login(user);
      // const data = await response.json();

      // const response = await fetch("http://localhost:3000/api/v1/user/login",
      const response = await fetch(
        "https://tether-p2-p-exchang-backend.vercel.app/api/v1/user/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
          credentials: "include",
        }
      );

      localStorage.removeItem("verified");
      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || data.message || "Failed to register user";
        ErrorToast(errorMsg);
        if (data.message === "User not Verified") return navigate("/verify");
        //  return response;
      }

      // Save user data to localStorage (could be just user object or a token)

      if (!data.user.isVerified) {
        // navigate("/verify"); // Redirect to the verification page
        return;
      } else {
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("isLoggedIn", "true");
        SuccessToast(t("messages.loginSuccess"));
        navigate("/dashboard/profile");
      }

      // console.log("User signed up:", user);
    } catch (error) {
      console.error("Error during sign-up:", error);
      // Optionally handle error here (e.g., show error message)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center px-4 sm:px-6"
      style={{ backgroundImage: "url('/bgg.png')" }}
    >
      <div className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 bg-gray-900/80 rounded-2xl shadow-xl  backdrop-blur-md">
        <h2 className="text-2xl font-bold text-center text-white mb-6 tracking-wide">
          {t("signIn.title")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nickname Input */}
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-300 mb-1">
              {t("signUp.username")}
            </label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={credentials.nickname}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600 transition"
              required
            />
            <div className="mt-1 text-sm text-right">
              <button
                type="button"
                onClick={() => modalOpen("nickname")}
                className="text-gray-400 italic cursor-pointer hover:underline"
              >
                {t("signIn.forgotNickname")}
              </button>
            </div>
          </div>

          {/* Password Input with Toggle */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              {t("signUp.password")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600 transition pr-10"
                required
              />
              <span
                className="absolute right-3 top-3 text-gray-400 hover:text-white cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </span>
            </div>

            <div className="mt-1 text-sm text-right">
              <button
                type="button"
                onClick={() => modalOpen("password")}
                className="text-gray-400 italic cursor-pointer hover:underline"
              >
                {t("signIn.forgotPassword")}
              </button>
            </div>
            <div className="mt-1 text-sm text-right">
              <a
                href="/recover-password"
                className="text-gray-400 cursor-pointer italic hover:underline"
              ></a>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white cursor-pointer text-base sm:text-lg font-semibold py-3 rounded-md shadow-md transition disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : t("signIn.submit")}
          </button>
        </form>
      </div>

      {/* Modal Call */}
      <ForgotNicknameModal
        isOpen={isNicknameModalOpen}
        onClose={() => setIsNicknameModalOpen(false)}
        type={forgotType}
      />
    </div>
  );
};

export default SignIn;
