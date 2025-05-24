import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../utils/AuthProvider";
import { SuccessToast } from "../../utils/Success";

const SignUp = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    nickname: "",
    password: "",
    fullName: "",
    dob: "",
    phone: "",
    bankName: "",
    bankAccount: "",
    tetherAddress: "",
    referralCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true); // Show loading state

    // Create the new user data
    const newUser = {
      ...formData,
      bankAccount: Number(formData.bankAccount),
      status: "inactive", // Set initial status as inactive
      admin: true, // Defaulting admin to false
    };

    try {
      // Call signUp from AuthContext (which will handle the state and potentially an API call)
      const response = await signUp(newUser);

      if (response) {
        SuccessToast(" you have successfully registered");
        navigate("/signin");
      } else {
        return;
      }

      console.log("User signed up:", newUser);
    } catch (error) {
      console.error("Error during sign-up:", error);
      // Optionally handle error here (e.g., show error message)
    } finally {
      setIsLoading(false); // Hide loading state after completion
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen px-4 py-10 pt-28"
      style={{
        backgroundImage: "url('/bgg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-5xl bg-gray-900/80  rounded-lg shadow-2xl p-6 md:p-10">
        <h2 className="text-2xl  font-bold text-white text-center mb-8">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-100 mb-1"
              >
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-md focus:outline-none focus:border-none"
                required
              />
            </div>

            {/* Nickname */}
            <div>
              <label
                htmlFor="nickname"
                className="block text-sm font-semibold text-gray-100 mb-1"
              >
                Nickname (Platform Name) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-md focus:outline-none focus:border-none"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-100 mb-1"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-md focus:outline-none focus:border-none"
                required
              />
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold text-gray-100 mb-1"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-md focus:outline-none focus:border-none"
                required
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-semibold text-gray-100 mb-1"
              >
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-md focus:outline-none focus:border-none"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-gray-100 mb-1"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-md focus:outline-none focus:border-none"
                required
              />
            </div>

            {/* Bank Name */}
            <div>
              <label
                htmlFor="bankName"
                className="block text-sm font-semibold text-gray-100 mb-1"
              >
                Bank Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="bankName"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-md focus:outline-none focus:border-none"
                required
              />
            </div>

            {/* Bank Account */}
            <div>
              <label
                htmlFor="bankAccount"
                className="block text-sm font-semibold text-gray-100 mb-1"
              >
                Bank Account Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="bankAccount"
                name="bankAccount"
                value={formData.bankAccount}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-md focus:outline-none focus:border-none"
                required
              />
            </div>

            {/* Tether Address */}
            <div>
              <label
                htmlFor="tetherAddress"
                className="block text-sm font-semibold text-gray-100 mb-1"
              >
                Tether Address (Solana address){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="tetherAddress"
                name="tetherAddress"
                value={formData.tetherAddress}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-md focus:outline-none focus:border-none"
                required
              />
            </div>

            {/* Referral Code */}
            <div>
              <label
                htmlFor="referralCode"
                className="block text-sm font-semibold text-gray-100 mb-1"
              >
                Referral Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="referralCode"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-md focus:outline-none focus:border-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-8 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-md transition duration-200"
          >
            {isLoading ? <LoadingSpinner /> : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
