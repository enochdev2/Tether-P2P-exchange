import { FaCopy } from "react-icons/fa";
import { SuccessToast } from "../utils/Success";

// components/ConfirmModal.jsx
const ConfirmModal2 = ({ open, onClose, onConfirm, message, classname = "fixed", message2 }) => {
  if (!open) return null;

  const handleCopy = (id) => {
    navigator.clipboard
      .writeText(id)
      .then(() => {
        // Optionally, you can show a success message or change the icon state
        SuccessToast("ID copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div
      className={`${classname} inset-0 z-50 bg-black/10 backdrop-blur-xs flex items-center justify-center transition-opacity`}
    >
      <div className="bg-white rounded-xl max-w-lg sm:max-w-xl shadow-2xl md:max-w-3xl w-full flex flex-col items-center justify-center p-6 sm:p-8 border border-gray-200 animate-fadeIn">
        <h2 className="text-lg text-center sm:text-2xl font-semibold text-black mb-6">
          {message || "These orders were created from the same account."}
        </h2>
        
        <div className="mb-5">
        {message2 && (
          <div className="w-full">
            <div className="flex items-center w-full mx-auto space-x-2 my-5">
              <div className="break-words break-all text-center text-lg text-black  sm:text-right w-full font-bold sm:w-auto">
                {message2}
              </div>
              <button
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => handleCopy(message2)} // Handle copy when clicked
              >
                <FaCopy size={16} /> {/* Copy icon */}
              </button>
            </div>
          </div>
        )}

        </div>


        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              // onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-xl cursor-pointer rounded-md bg-[#26a17b] hover:bg-green-700 text-white font-medium transition-all"
          >
            Check
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal2;
