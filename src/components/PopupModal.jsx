import React from "react";

const PopupModal = ({ message, onClose }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className="  bg-opacity-10 flex justify-center items-center z-[1000]"
        onClick={onClose} // close on background click
      >
        {/* Modal box */}
        <div
          className="bg-gray-300 rounded-[20px] border border-black w-full px-8 py-5 box-border space-y-6 font-sans text-sm md:text-lg text-gray-900 cursor-default"
          onClick={(e) => e.stopPropagation()} // prevent close on modal click
        >
          <p className="mb-5 md:mb-10 md:text-2xl">{message}</p>
          <div className="text-center">
            <button
              className="px-4 py-1 text-sm md:text-base rounded border border-gray-500 bg-gray-200 cursor-pointer hover:bg-gray-300"
              onClick={onClose}
            >
              okay
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PopupModal;
