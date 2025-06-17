// components/ConfirmModal.jsx
const ConfirmModal3 = ({ open, onClose, onConfirm, message }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-gray-200 animate-fadeIn">
        <h2 className="text-lg text-center sm:text-xl font-semibold text-gray-800 mb-6">
          {message || "Are you sure you want to proceed?"}
        </h2>
        
        <div className="flex justify-between gap-4">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 cursor-pointer rounded-md bg-[#26a17b] hover:bg-green-700 text-white text-sm font-medium transition-all"
          >
            Yes, Proceed
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 cursor-pointer rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium transition-all"
          >
            No, Cancel
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal3;
