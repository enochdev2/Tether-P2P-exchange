import React, { useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthProvider";
import { SuccessToast } from "../../utils/Success";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignIn = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    nickname: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

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
      // Call signUp from AuthContext (which will handle the state and potentially an API call)
      const response = await login(user);

      if (response) {
        SuccessToast(" Login successfully");
        navigate("/dashboard/profile");
      } else {
        return;
      }

      console.log("User signed up:", user);
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
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nickname Input */}
          <div>
            <label
              htmlFor="nickname"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Nickname
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
          </div>

          {/* Password Input with Toggle */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Password
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
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white text-base sm:text-lg font-semibold py-3 rounded-md shadow-md transition disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
