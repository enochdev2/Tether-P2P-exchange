import React from "react";

const ProgressBar = ({ status, currentStep, amount, address }) => {
  // Determine the current status
  const getStatusText = () => {
    switch (status) {
      case "completed":
        return "Completed";
      case "paymentCompleted":
        return "Payment completed";
      case "waiting":
        return "Waiting for a deal";
      default:
        return "Unknown Status";
    }
  };

  const stepClass = (step) => (step === currentStep ? "bg-blue-500" : "bg-gray-300");

  return (
    <div className="p-6 bg-white shadow-lg rounded-md">
      {/* Status Text */}
      <div className="flex items-center mb-4">
        <div className="text-green-500 mr-2">✔</div>
        <span className="font-bold text-xl">{getStatusText()}</span>
      </div>

      {/* Progress Steps */}
      <div className="flex space-x-4 mb-4">
        <div className={`w-6 h-6 rounded-full ${stepClass(1)}`} />
        <div className={`w-6 h-6 rounded-full ${stepClass(2)}`} />
        <div className={`w-6 h-6 rounded-full ${stepClass(3)}`} />
      </div>

      {/* Warning/Message */}
      <div className="bg-yellow-400 text-red-600 text-center p-2 mb-4 font-semibold">
        This process requires further review.
      </div>

      {/* Transaction Details */}
      <div className="text-center">
        <p className="font-semibold text-xl">{amount} USDT</p>
        <p className="text-sm text-gray-500">Phantom Wallet Address: {address}</p>
      </div>

      {/* Transaction Step Description */}
      <div className="text-center mt-4 text-sm text-gray-500">
        {status === "completed" && <p>Transaction complete: The transaction has been completed !!</p>}
        {status === "paymentCompleted" && (
          <p>Payment has been confirmed. We are requesting payment from the buyer.</p>
        )}
        {status === "waiting" && <p>Waiting for a deal</p>}
      </div>
    </div>
  );
};

export default ProgressBar;
