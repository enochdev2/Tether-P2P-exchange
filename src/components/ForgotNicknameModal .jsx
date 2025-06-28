import { useTranslation } from "react-i18next";
import Modal from "./Modal";
import { IoClose } from "react-icons/io5";

const ForgotNicknameModal = ({ isOpen, onClose, type }) => {
  const { t } = useTranslation();
  const isNickname = type === "nickname";
  const header = isNickname ? t("signIn.findNickname") : t("signIn.findPassword");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative w-full max-w-sm rounded-lg px-6 md:px- space-y-20 shadow-2xl border border-slate-900 py-6">
        <div className="flex relative">
          {/* Close Icon */}
          <button
            onClick={onClose}
            className="absolute -top-3 cursor-pointer -right-1 text-gray-100 hover:text-black text-2xl"
          >
            <IoClose />
          </button>

          {/* Title */}
          <h2 className="text-center w-full text-xl text-gray-100 uppercase font-bold mb-4">{header}</h2>
        </div>

        <div>
          {/* Description */}
          <p className="text-center text-gray-100 mb-6">{t("signIn.contactAdmin")}</p>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <a
            href="https://t.me/+VGrfRMTwfHUxMTBl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md transition"
          >
            {t("signIn.joinTelegram")}
          </a>
        </div>
      </div>
    </Modal>
  );
};

export default ForgotNicknameModal;
