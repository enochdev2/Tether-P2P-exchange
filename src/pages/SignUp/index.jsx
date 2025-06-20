import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../utils/AuthProvider";
import { SuccessToast } from "../../utils/Success";
import { ErrorToast } from "../../utils/Error";
import { useTranslation } from "react-i18next";
import { X, UploadCloud } from "lucide-react";
import avatarImage from "../../assets/avatarImage.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import solanaImage from "../../assets/solanaImage.png";

// Assume these imports exist for your toasts and AuthProvider
// import LoadingSpinner from "../../components/LoadingSpinner";
// import { useAuth } from "../../utils/AuthProvider";
// import { SuccessToast } from "../../utils/Success";
// import { ErrorToast } from "../../utils/Error";

const SignUp = () => {
  const { t } = useTranslation();
  const { signUp } = useAuth(); // Assuming useAuth provides a signUp function
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showUploadGuide, setShowUploadGuide] = useState(false);
  const [rawFile, setRawFile] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    nickname: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    dob: "",
    phone: "", // Keep phone in formData
    bankName: "",
    bankAccount: "",
    telegram: "",
    tetherAddress: "",
    referralCode: "",
  });

  // New state for phone verification
  const [showPhoneVerificationModal, setShowPhoneVerificationModal] = useState(false);
  const [smsCode, setSmsCode] = useState(["", "", "", "", "", ""]); // Array for 6 digits
  const [phoneVerificationMessage, setPhoneVerificationMessage] = useState("");
  const [phoneVerificationStatus, setPhoneVerificationStatus] = useState("pending"); // 'pending', 'sent', 'resent', 'completed', 'error'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);

  useEffect(() => {
    const verified = JSON.parse(localStorage.getItem("verified"));
    console.log("🚀 ~ useEffect ~ verified:", verified);
    if (verified?.isVerified) {
      setPhoneVerificationStatus("completed");
      setFormData({ phone: verified.phone });
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setshowConfirmPassword((prev) => !prev);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(URL.createObjectURL(file));
      setRawFile(file); // store the actual file
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.username.trim()) errors.push("Username is required.");
    if (!formData.nickname.trim()) errors.push("Nickname is required.");
    if (!formData.fullName.trim()) errors.push("Full name is required.");
    if (!formData.password || formData.password.length < 5)
      errors.push("Password must be at least 5 characters.");
    if (!formData.dob) errors.push("Date of birth is required.");
    // Phone validation will be handled by the verification flow
    if (!formData.bankName.trim()) errors.push("Bank name is required.");
    if (!formData.bankAccount || isNaN(formData.bankAccount))
      errors.push("Valid bank account number is required.");
    if (!formData.tetherAddress.trim()) errors.push("Tether address is required.");

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // --- Phone Verification Handlers ---
  const handleSendSmsCode = async () => {
    // Basic phone number validation before sending SMS
    if (!formData.phone || !/^\d{10,15}$/.test(formData.phone)) {
      ErrorToast("Please enter a valid phone number.");
      return;
    }

    setIsLoading(true);
    setPhoneVerificationMessage(""); // Clear previous messages
    try {
      // Simulate API call to send SMS
      console.log(`Sending SMS to: ${formData.phone}`);
      const response = await fetch(
        // "https://tether-p2p-exchang-backend.onrender.com/api/v1/user/users/sendCode",
        "http://localhost:3000/api/v1/user/users/sendCode",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: formData.phone, // Pass the userId (could be from props or context)
          }),
        }
      );

      const result = await response.json();

      // Check if the response is successful
      if (!response.ok) {
        setPhoneVerificationMessage(result.error || "Invalid OTP. Please try again.");
        return;
      }
      setPhoneVerificationStatus("sent"); //
      setPhoneVerificationMessage("SMS code sent to your phone.");
      setShowPhoneVerificationModal(true); // Open modal for code input
      SuccessToast("SMS code sent successfully!");
    } catch (error) {
      console.error("Error sending SMS:", error);
      setPhoneVerificationMessage("Failed to send SMS. Please try again.");
      ErrorToast("Failed to send SMS.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendSmsCode = async () => {
    setIsLoading(true);
    setPhoneVerificationMessage("");
    try {
      // Simulate API call to resend SMS
      console.log(`Resending SMS to: ${formData.phone}`);

      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/user/users/resendverify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: formData.phone,
          }), // Replace with actual user data
        }
      );

      const result = await response.json();
      if (!response.ok) {
        // Handle error response from API
        setPhoneVerificationMessage(result.error || "Failed to resend OTP. Please try again.");
        return;
      }

      setPhoneVerificationStatus("resent"); //
      setPhoneVerificationMessage("The SMS has been resent."); //
      SuccessToast("SMS code resent successfully!");
    } catch (error) {
      console.error("Error resending SMS:", error);
      setPhoneVerificationMessage("Failed to resend SMS. Please try again.");
      ErrorToast("Failed to resend SMS.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSmsCodeChange = (e, index) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 1) {
      // Only allow single digit
      const newSmsCode = [...smsCode];
      newSmsCode[index] = value;
      setSmsCode(newSmsCode);

      // Auto-focus to next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`sms-code-input-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const handleSmsCodeKeyDown = (e, index) => {
    if (e.key === "Backspace" && smsCode[index] === "" && index > 0) {
      const prevInput = document.getElementById(`sms-code-input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleSubmitSmsCode = async () => {
    const enteredCode = smsCode.join("");
    if (enteredCode.length !== 6 || !/^\d{6}$/.test(enteredCode)) {
      ErrorToast("Please enter a valid 6-digit SMS code.");
      return;
    }
    console.log(`Verifying SMS code: ${enteredCode}`);

    setIsLoading(true);
    setPhoneVerificationMessage("");
    try {
      // Simulate API call to verify SMS code
      const response = await fetch("http://localhost:3000/api/v1/user/users/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formData.phone, // Pass the userId (could be from props or context)
          verificationCode: enteredCode, // The OTP entered by the user
        }),
      });

      const result = await response.json();
      console.log("🚀 ~ handleSubmitSmsCode ~ result:", result.data.isVerified);
      localStorage.setItem("verified", JSON.stringify(result.data));

      // Check if the response is successful
      if (!response.ok) {
        // Display error message if OTP verification fails
        setPhoneVerificationMessage(result.error || "Invalid OTP. Please try again.");
        return;
      }

      setPhoneVerificationStatus("completed"); //
      setPhoneVerificationMessage("Phone verification completed."); //
      SuccessToast("Phone verification completed!");
      setShowPhoneVerificationModal(false);

      // Simulate success/failure
      // if (enteredCode === "123456") {
      //   // Example correct code
      //   setPhoneVerificationStatus("completed"); //
      //   setPhoneVerificationMessage("Phone verification completed."); //
      //   SuccessToast("Phone verification completed!");
      //   // Automatically close modal after a short delay
      //   setTimeout(() => setShowPhoneVerificationModal(false), 2000);
      // } else {
      //   setPhoneVerificationStatus("error");
      //   setPhoneVerificationMessage("Invalid SMS code. Please try again.");
      //   ErrorToast("Invalid SMS code.");
      // }
    } catch (error) {
      console.error("Error verifying SMS:", error);
      setPhoneVerificationMessage("Error verifying code. Please try again.");
      ErrorToast("Error verifying code.");
    } finally {
      setIsLoading(false);
    }
  };
  // --- End Phone Verification Handlers ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((err) => ErrorToast(err));
      setIsLoading(false);
      return;
    }

    // Ensure phone is verified before proceeding with main signup
    if (phoneVerificationStatus !== "completed") {
      ErrorToast("Please complete phone verification first.");
      setIsLoading(false);
      return;
    }
    if (formData.confirmPassword !== formData.password) {
      ErrorToast("The passwords you entered do not match. Please make sure both fields are same.");
      setIsLoading(false);
      return;
    }

    try {
      let imageUrl = "";

      if (rawFile) {
        // Create FormData for image
        const formDataImage = new FormData();
        formDataImage.append("file", rawFile);

        // Upload to backend (you’ll create this endpoint below)
        const imageRes = await fetch(
          "https://tether-p2p-exchang-backend.onrender.com/api/v1/upload",
          {
            method: "POST",
            body: formDataImage,
          }
        );

        const imageData = await imageRes.json();
        imageUrl = imageData.url; // Get the Cloudinary URL
      }

      console.log("🚀 ~ handleSubmit ~ imageUrl:", imageUrl);
      // Create the new user data
      const newUser = {
        ...formData,
        bankAccount: Number(formData.bankAccount),
        tetherIdImage: imageUrl,
        status: "inactive", // Set initial status as inactive
      };

      // Call signUp from AuthContext (which will handle the state and potentially an API call)
      const response = await signUp(newUser);

      if (response.ok) {
        SuccessToast(" you have successfully registered");
        navigate("/signin"); // Navigate to a success/verify page
      } else {
        // Error handling if response is not ok
        // For example, if response.json() has an error message
        const errorData = await response.json();
        ErrorToast(errorData.message || "Sign-up failed.");
      }

      console.log("User signed up:", newUser);
    } catch (error) {
      console.error("Error during sign-up:", error);
      ErrorToast("An unexpected error occurred during sign-up.");
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
      <div className="w-full max-w-5xl bg-gray-900/80 rounded-lg shadow-2xl p-6 md:p-10">
        <h2 className="text-2xl font-bold text-white text-center mb-8">{t("signUp.title")}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-100 mb-1">
                {t("signUp.username")} <span className="text-red-500">*</span>
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
              <label htmlFor="nickname" className="block text-sm font-semibold text-gray-100 mb-1">
                {t("signUp.nickname")} <span className="text-red-500">*</span>
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

            {/* Phone Number (Initial input and Send SMS button) */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-100 mb-1">
                {t("signUp.phone")} <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t("signUp.phonePlaceholder")}
                  className={`flex-1 px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-md focus:outline-none focus:border-none placeholder:text-sm placeholder:text-gray-400 placeholder:italic ${
                    phoneVerificationStatus === "completed" ? "border-green-500" : ""
                  }`}
                  required
                  disabled={phoneVerificationStatus === "completed"} // Disable if already completed [cite: 9]
                />
                {phoneVerificationStatus === "completed" ? (
                  <span className="px-4 py-2 bg-green-500 text-white rounded-md text-sm">
                    Completed
                  </span> //
                ) : (
                  <button
                    type="button"
                    onClick={handleSendSmsCode} // [cite: 2]
                    disabled={isLoading || !formData.phone || !/^\d{10,15}$/.test(formData.phone)}
                    className="px-4 py-3 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send SMS code
                  </button>
                )}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-100 mb-1">
                {t("signUp.fullName")} <span className="text-red-500">*</span>
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

            {/* Password */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-100 mb-1">
                {t("signUp.password")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="cpassword" className="block text-sm font-semibold text-gray-100 mb-1">
                {/* {t("signUp.cpassword")}  */}
                {t("signUp.confirmPassword")}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-md focus:outline-none focus:border-none"
                  required
                />

                <span
                  className="absolute right-3 top-3 text-gray-400 hover:text-white cursor-pointer"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </span>
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dob" className="block text-sm font-semibold text-gray-100 mb-1">
                {t("signUp.dob")} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                placeholder=""
                className="w-full px-4 py-3 border border-gray-600 bg-white text-gray-900 rounded-md focus:outline-none focus:border-none"
                required
              />
            </div>

            {/* Bank Name */}
            <div>
              <label htmlFor="bankName" className="block text-sm font-semibold text-gray-100 mb-1">
                {t("signUp.bankName")} <span className="text-red-500">*</span>
              </label>

              <div className="relative w-full">
                <input
                  type="text"
                  id="bankName"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-16 border border-gray-600 bg-gray-900 text-white rounded-md focus:outline-none focus:border-none"
                  required
                />
                <span className="absolute inset-y-0 right-4 flex items-center text-gray-400 text-sm pointer-events-none">
                  {t("signUp.bankPlaceholder")}
                </span>
              </div>
            </div>

            {/* Bank Account */}
            <div>
              <label
                htmlFor="bankAccount"
                className="block text-sm font-semibold text-gray-100 mb-1"
              >
                {t("signUp.bankAccount")} <span className="text-red-500">*</span>
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
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="tetherAddress"
                  className="block text-sm font-semibold text-gray-100"
                >
                  {t("signUp.tetherAddress")} <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowGuide(true)}
                  className="text-xs bg-green-200 cursor-pointer px-2 py-0.5 rounded text-black"
                >
                  Guide
                </button>
              </div>

              {/* Input Field */}
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

            {/* Guide Modal */}
            {showGuide && (
              <div className="fixed mx-4 md:mx-0 inset-0 bg-black/50 z-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg lg:max-w-3xl w-full  p-4 md:p-6 relative">
                  <button
                    className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowGuide(false)}
                  >
                    <X size={18} />
                  </button>

                  <div className="lg:grid lg:items-center  lg:gap-9 lg:grid-cols-12 flex flex-col ">
                    <div className="col-span-7 text-justify">
                      <h2 className=" text-base md:text-lg font-semibold mb-3">{t("signUp.tetherGuide")}</h2>
                      <div className=" text-xs md:text-sm text-gray-700 space-y-2 ">
                        <p>{t("signUp.tetherGuideNote1")}</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>{t("signUp.tetherGuideNote2")}</li>
                          <li> {t("signUp.tetherGuideNote3")}</li>
                          <li>{t("signUp.tetherGuideNote4")}</li>
                        </ul>
                        <p>
                          <span className="font-bold">⚠️{t("signUp.tetherGuideNote5")}</span> <br />
                          {t("signUp.tetherGuideNote6")}
                        </p>

                        <p>{t("signUp.tetherGuideNote7")}</p>
                      </div>
                    </div>

                    <div className="col-span-5 lg:block hidd">
                      <img src={solanaImage} className=" w-40 md:w-80" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Referral Code */}
            <div>
              <label
                htmlFor="referralCode"
                className="block text-sm font-semibold text-gray-100 mb-1"
              >
                {t("signUp.referralCode")} <span className="text-red-500">*</span>
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

            {/* Telegram Id */}
            <div>
              <label
                htmlFor="referralCode"
                className="block text-sm font-semibold text-gray-100 mb-1"
              >
                {/* {t("signUp")}  */}
                {t("signUp.telegram")}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="telegram"
                name="telegram"
                value={formData.telegram}
                onChange={handleChange}
                pattern="[^@]*" // Regex: anything except '@'
                title="You are not allowed to use '@' in Telegram ID"
                placeholder={t("signUp.telegramPlaceholder")}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-md focus:outline-none focus:border-none"
                required
              />
            </div>

            {/* Upload Image Guide Modal */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-semibold text-gray-100">
                  {t("signUp.uploadCardImage")}
                  <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowUploadGuide(true)}
                  className="text-xs bg-green-200 cursor-pointer px-2 py-0.5 rounded text-black"
                >
                  Guide
                </button>
              </div>
              <div className="border border-dashed border-gray-500 p-4 rounded-md bg-gray-800 cursor-pointer relative group hover:border-blue-400">
                <label className="w-full flex flex-col items-center justify-center text-center text-gray-300 cursor-pointer">
                  <UploadCloud className="w-8 h-8 mb-2 text-gray-400 group-hover:text-blue-400" />
                  <span className="text-sm">Click to upload image (JPG/PNG)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                </label>
              </div>
              {uploadedFile && (
                <div className="mt-3">
                  <img
                    src={uploadedFile}
                    alt="Uploaded"
                    className="w-40 h-auto rounded border border-gray-600"
                  />
                </div>
              )}

              <p className="text-sm font-semibold text-justify text-gray-100 mt-2">
                {t("signUp.uploadCardText1")} <br />
                <span className="lg:block">{t("signUp.uploadCardText2")}</span>
              </p>
            </div>

            {showUploadGuide && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-4 relative">
                  <button
                    className="absolute cursor-pointer top-2 right-2 text-gray-500 hover:text-black"
                    onClick={() => setShowUploadGuide(false)}
                  >
                    <X size={18} />
                  </button>
                  <h2 className="text-lg font-semibold mb-2 text-center">{t("signUp.uploadGuideText1")}</h2>
                  <img src={avatarImage} alt="Guide Example" className="w-full h-56 rounded mb-3" />
                  <p className="text-sm text-gray-700">{t("signUp.uploadGuideText2")}</p>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || phoneVerificationStatus !== "completed"} // Disable if phone not verified
            className="w-full mt-8 py-3 bg-green-700 hover:bg-green-800 text-white cursor-pointer font-semibold rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <LoadingSpinner /> : t("signUp.submit")}
          </button>
        </form>
      </div>

      {/* Phone Verification Modal (from pages 3-8 of PDF) */}
      {showPhoneVerificationModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg shadow-2xl p-6 relative max-w-sm w-full border border-gray-700">
            {/* Close button */}
            {phoneVerificationStatus !== "completed" && ( // Don't show close button if verification completed
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
                onClick={() => setShowPhoneVerificationModal(false)}
              >
                <X size={20} />
              </button>
            )}

            <h3 className="text-xl font-bold text-white text-center mb-6">
              Phone Number Verification
            </h3>

            {phoneVerificationStatus !== "completed" && (
              <>
                <p className="text-gray-300 text-center mb-4">
                  A 6-digit code has been sent to{" "}
                  <span className="font-semibold">{formData.phone}</span>.
                </p>

                <div className="flex justify-center space-x-2 mb-6">
                  {smsCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`sms-code-input-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleSmsCodeChange(e, index)}
                      onKeyDown={(e) => handleSmsCodeKeyDown(e, index)}
                      className="w-10 h-12 text-center text-2xl font-bold text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 caret-transparent"
                    />
                  ))}
                </div>

                {phoneVerificationMessage && (
                  <p
                    className={`text-center text-sm mb-4 ${
                      phoneVerificationStatus === "error" ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {phoneVerificationMessage}
                  </p>
                )}

                <div className="flex flex-col space-y-3">
                  <button
                    type="button"
                    onClick={handleSubmitSmsCode}
                    disabled={isLoading || smsCode.join("").length !== 6}
                    className="w-full py-3 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <LoadingSpinner /> : "Submit"}
                  </button>
                  <button
                    type="button"
                    onClick={handleResendSmsCode}
                    disabled={isLoading}
                    className="w-full py-2 text-gray-300 hover:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Resend SMS code
                  </button>
                </div>
              </>
            )}

            {phoneVerificationStatus === "completed" && (
              <div className="text-center">
                <p className="text-green-400 text-lg font-semibold mb-4">
                  Phone verification completed.
                </p>{" "}
                {/*  */}
                <button
                  type="button"
                  onClick={() => setShowPhoneVerificationModal(false)}
                  className="w-full py-3 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
