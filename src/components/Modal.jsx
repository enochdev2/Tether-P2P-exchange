import React from "react";

const Modal = ({ isOpen,  children, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50  flex min-h-screen items-center justify-center bg-black/50 bg-opacity-50 ">
      <div className="relative w-full max-w-sm  rounded-lg shadow-lg  bg-gray-950 p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-100">{content}</h2>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Modal;
