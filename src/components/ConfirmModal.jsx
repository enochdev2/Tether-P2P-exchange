// components/ConfirmModal.jsx
const ConfirmModal = ({ open, onClose, onConfirm, message }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-md border border-slate-400">
        <p className="text-gray-700 text-base mb-10 font-bold">{message || "Are you sure you want to proceed?"}</p>
        <div className="flex justify-between space-x-4">
        <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-sm rounded cursor-pointer bg-[#26a17b] hover:bg-green-700 text-white"
          >
            Yes, Proceed
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded bg-gray-300 hover:bg-gray-400 cursor-pointer"
          >
           No, Cancel
          </button>
        </div>
          
      </div>
    </div>
  );
};

export default ConfirmModal;
