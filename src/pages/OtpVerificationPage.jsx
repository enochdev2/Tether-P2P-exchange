import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthProvider";
import { SuccessToast } from "../utils/Success";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const OtpVerificationPage = ({
  onVerifySuccess,
  onResendOtp,
  userIdentifier,
}) => {
   const { t } = useTranslation();

  // const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // State for 6 individual OTP digits
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(60); // 60 seconds for resend
  const [canResend, setCanResend] = useState(false);

  // Effect to manage the resend timer
  useEffect(() => {
    let timer;
    if (resendTimer > 0 && !canResend) {
      timer = setTimeout(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer); // Cleanup timer on component unmount or re-render
  }, [resendTimer, canResend]);

  // Handle OTP input change for individual digits
  const handleChange = (e, index) => {
    const { value } = e.target;
    // Allow only single digit numbers
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus to next input
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  // Handle paste event for OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    if (/^\d{6}$/.test(pastedData)) {
      // Expecting a 6-digit OTP
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      setErrorMessage(""); // Clear any previous errors
    } else {
      setErrorMessage("Invalid paste format. Please paste a 6-digit number.");
    }
  };

  // Handle backspace key to clear and move to previous input
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  // Handle OTP submission

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable submit button while submitting
    setErrorMessage(""); // Clear previous error message

    // Combine the OTP digits into a single string
    const fullOtp = otp.join("");

    // Check if the OTP entered is valid (6 digits)
    if (fullOtp.length !== 6 || !/^\d{6}$/.test(fullOtp)) {
      setErrorMessage("Please enter a valid 6-digit OTP.");
      setIsSubmitting(false);
      return;
    }
    const user = JSON.parse(localStorage.getItem("user"));

    // "http://localhost:3000/api/v1/user/users/verify",
    try {
      // Make API call to verify the OTP
      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/user/users/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nickname: user.nickname, // Pass the userId (could be from props or context)
            code: fullOtp, // The OTP entered by the user
          }),
        }
      );

      const result = await response.json();

      // Check if the response is successful
      if (!response.ok) {
        // Display error message if OTP verification fails
        setErrorMessage(result.error || "Invalid OTP. Please try again.");
        setIsSubmitting(false); // Enable the submit button again
        return;
      }

      navigate("/signin");
      SuccessToast(t("messages.otpVerified"));
    } catch (error) {
      setErrorMessage(
        "An error occurred during verification. Please try again."
      );
      console.error("OTP verification error:", error);
    } finally {
      setIsSubmitting(false); // Enable submit button again after operation completes
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false); // Disable resend button until timer resets
    setResendTimer(60); // Reset timer to 60 seconds
    setErrorMessage(""); // Clear any previous errors
    setOtp(["", "", "", "", "", ""]); // Clear OTP input
    try {
      // Make API call to resend verification code
      // "http://localhost:3000/api/v1/user/users/resendverify",
      const user = JSON.parse(localStorage.getItem("user"));
      console.log(user);
      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/user/users/resendverify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nickname: user.nickname,
            phone: user.phone,
          }), // Replace with actual user data
        }
      );

      const result = await response.json();
      if (!response.ok) {
        // Handle error response from API
        setErrorMessage(
          result.error || "Failed to resend OTP. Please try again."
        );
        return;
      }

      // Call onResendOtp (provided by parent component)
      onResendOtp();

      alert("OTP has been re-sent successfully!"); // Use a custom modal in a real app
    } catch (error) {
      setErrorMessage("Failed to re-send OTP. Please try again.");
      console.error("Resend OTP error:", error);
    }
  };
  console.log("🚀 ~ handleResend ~ setOtp:", setOtp);
  console.log("🚀 ~ handleResend ~ setOtp:", setOtp);
  console.log("🚀 ~ handleResend ~ setOtp:", setOtp);

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-5 font-inter p-4"
      style={{ backgroundImage: "url('/bgg.png')" }}
    >
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
          OTP Verification
        </h2>
        <p className="text-gray-600 mb-6">
          A 6-digit code has been sent to your{" "}
          {userIdentifier
            ? `account for ${userIdentifier}`
            : "registered email/phone"}
          . Please enter the code below. a
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : undefined} // Only allow paste on the first input
                className="w-12 h-12 text-2xl text-center border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors duration-200"
                required
                disabled={isSubmitting}
              />
            ))}
          </div>

          {errorMessage && (
            <p className="text-red-600 text-sm">{errorMessage}</p>
          )}

          <button
            type="submit"
            className={`w-full cursor-pointer py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 ease-in-out
              ${
                isSubmitting
                  ? "bg-green-700 cursor-not-allowed"
                  : "bg-green-700 hover:bg-green-800 shadow-lg hover:shadow-xl transform hover:scale-105"
              }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Verify OTP "}
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-700">
          Didn't receive the code?{" "}
          <button
            onClick={handleResend}
            className={`font-semibold transition-colors cursor-pointer duration-200
              ${
                canResend
                  ? "text-blue-600 hover:text-blue-800"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            disabled={!canResend || isSubmitting}
          >
            {canResend ? "Resend OTP" : `Resend in ${resendTimer}s`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationPage;

// Handle resend OTP request
// const handleResend = async () => {
//   if (!canResend) return;

//   setCanResend(false);
//   setResendTimer(60); // Reset timer
//   setErrorMessage("");
//   setOtp(["", "", "", "", "", ""]); // Clear OTP input

//   try {
//     // Replace with your actual resend OTP API call
//     console.log(`Resending OTP to: ${userIdentifier}`);
//     await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay
//     onResendOtp(); // Call the prop function
//     alert("OTP has been re-sent successfully!"); // Use a custom modal in a real app
//   } catch (error) {
//     setErrorMessage("Failed to re-send OTP. Please try again.");
//     console.error("Resend OTP error:", error);
//   }
// };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setIsSubmitting(true);
//   setErrorMessage("");

//   const fullOtp = otp.join("");

//   if (fullOtp.length !== 6 || !/^\d{6}$/.test(fullOtp)) {
//     setErrorMessage("Please enter a valid 6-digit OTP.");
//     setIsSubmitting(false);
//     return;
//   }

//   // Simulate API call for OTP verification
//   try {
//     // Replace with your actual OTP verification API call
//     console.log(`Verifying OTP: ${fullOtp} for user: ${userIdentifier}`);
//     await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay

//     if (fullOtp === "123456") {
//       // Example correct OTP
//       onVerifySuccess(fullOtp);
//     } else {
//       setErrorMessage("Invalid OTP. Please try again.");
//     }
//   } catch (error) {
//     setErrorMessage(
//       "An error occurred during verification. Please try again."
//     );
//     console.error("OTP verification error:", error);
//   } finally {
//     setIsSubmitting(false);
//   }
// };
