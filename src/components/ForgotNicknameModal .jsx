import Modal from "./Modal";
import { IoClose } from "react-icons/io5";

const ForgotNicknameModal = ({ isOpen, onClose, type }) => {
    const isNickname = type === 'nickname';
    const header = isNickname ? "Find Your Nickname" : "Find Your Password"

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative w-full max-w-sm rounded-lg p-6">

        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute -top-3 cursor-pointer -right-1 text-gray-600 hover:text-black text-2xl"
        >
          <IoClose />
        </button>

        {/* Title */}
        <h2 className="text-center text-xl uppercase font-bold mb-4">{header}</h2>

        {/* Description */}
        <p className="text-center text-gray-700 mb-6">
          Please contact the administrator through the Telegram link.
        </p>

        {/* CTA */}
        <div className="flex justify-center">
          <a
            href="https://t.me/+VGrfRMTwfHUxMTBl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md transition"
          >
            Join Telegram
          </a>
        </div>
      </div>
    </Modal>
  );
};

export default ForgotNicknameModal;
