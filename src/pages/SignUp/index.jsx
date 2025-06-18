import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../utils/AuthProvider";
import { SuccessToast } from "../../utils/Success";
import { ErrorToast } from "../../utils/Error";
import { useTranslation } from "react-i18next";
import { X, UploadCloud } from "lucide-react";
import avatarImage from "../../assets/avatarImage.png";

const SignUp = () => {
  const { t } = useTranslation();
  const { signUp } = useAuth();
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
    fullName: "",
    dob: "",
    phone: "",
    bankName: "",
    bankAccount: "",
    tetherAddress: "",
    referralCode: "",
  });

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
    if (!formData.phone || !/^\d{10,15}$/.test(formData.phone))
      errors.push("Enter a valid phone number.");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((err) => ErrorToast(err));
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
        const imageRes = await fetch("http://localhost:3000/api/v1/upload", {
          method: "POST",
          body: formDataImage,
        });
        
        const imageData = await imageRes.json();
        imageUrl = imageData.url; // Get the Cloudinary URL
      }
      
      console.log("🚀 ~ handleSubmit ~ imageUrl:", imageUrl)
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
        navigate("/verify");
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
        <h2 className="text-2xl  font-bold text-white text-center mb-8">{t("signUp.title")}</h2>
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
                {t("signUp.nickname")} (Platform Name) <span className="text-red-500">*</span>
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
              <label htmlFor="password" className="block text-sm font-semibold text-gray-100 mb-1">
                {t("signUp.password")} <span className="text-red-500">*</span>
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
                className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-md focus:outline-none focus:border-none"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-100 mb-1">
                {t("signUp.phone")} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t("signUp.phonePlaceholder")}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-md focus:outline-none focus:border-none placeholder:text-sm placeholder:text-gray-400 placeholder:italic"
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
                  {/* Bank */}
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
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
                  <button
                    className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowGuide(false)}
                  >
                    <X size={18} />
                  </button>
                  <h2 className="text-lg font-semibold mb-3">Tether Address Guide</h2>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>
                      Your <strong>Tether (USDT) address</strong> is a unique string of letters and
                      numbers used to receive USDT cryptocurrency. We use this address to process
                      payments or withdrawals related to your account.
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        Ensure the address is a valid <strong>TRC20</strong> or{" "}
                        <strong>ERC20</strong> USDT address (depending on what we support).
                      </li>
                      <li>
                        Copy it directly from your wallet (e.g., Trust Wallet, Binance, Coinbase,
                        etc.).
                      </li>
                      <li>
                        Make sure the address belongs to <strong>you</strong>, not someone else.
                      </li>
                    </ul>
                    <p className="text-red-600 font-medium">
                      ⚠️ Double-check the address before submitting.
                      <br />
                      Incorrect addresses may lead to <strong>loss of funds</strong>, and we will{" "}
                      <strong>not</strong> be able to recover them.
                    </p>
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

            {/* Upload Image Guide Modal */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-semibold text-gray-100">
                  Upload Tether ID Image
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

              <p className="text-sm font-semibold text-gray-100 mt-2">
                A photo showing both the ID card and the face together
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
                  <h2 className="text-lg font-semibold mb-2 text-center">Upload Guide</h2>
                  <img src={avatarImage} alt="Guide Example" className="w-full h-56 rounded mb-3" />
                  <p className="text-sm text-gray-700">
                    Upload a clear image of you holding a valid ID card. Your face and ID details
                    must be visible. The image should resemble the example above. Blurry, cropped,
                    or fake IDs will not be accepted.
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-8 py-3 bg-green-700 hover:bg-green-800 text-white cursor-pointer font-semibold rounded-md transition duration-200"
          >
            {isLoading ? <LoadingSpinner /> : t("signUp.submit")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
