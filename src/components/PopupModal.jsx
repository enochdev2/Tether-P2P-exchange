import React from "react";
import { IoMdClose } from "react-icons/io"; // using react-icons for the close icon

const PopupModal = ({ message, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-[999] bg-black/80 bg-opacity-40 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-md rounded-2xl shadow-lg p-6 md:p-8 space-y-6 text-gray-800 font-sans animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 cursor-pointer right-3 text-gray-500 hover:text-[#26a17b] text-xl md:text-2xl"
          aria-label="Close"
        >
          <IoMdClose />
        </button>

       <div className="py-9 space-y-10">
         <p className="text-base md:text-xl font-medium leading-relaxed">
          {message}
        </p>
        <div className="text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm md:text-base font-medium text-white bg-gradient-to-br from-[#26a17b] to-[#0d4e3a] rounded-lg hover:bg-[#0d4e3a] cursor-pointer transition duration-300"
          >
            Okay
          </button>
       </div>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
