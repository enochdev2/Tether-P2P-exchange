import React from "react";

const Modal = ({ isOpen, onClose, children, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-black/50 bg-opacity-50">
      <div className="relative w-full max-w-sm  rounded-lg shadow-lg  bg-white p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">{content}</h2>

          {/* <button
            onClick={onClose}
            className="text-gray-500 cursor-pointer text-2xl hover:text-gray-700"
          >
            &times;
          </button> */}
        </div>

        {children || <p className="text-lg">Hello World</p>}
      </div>
    </div>
  );
};

export default Modal;
