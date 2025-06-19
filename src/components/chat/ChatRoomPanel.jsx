// ChatRoomPanel.js
import React from "react";
import { FiArrowLeft, FiImage, FiCopy } from "react-icons/fi";
import { FiUser, FiShoppingBag, FiShield } from "react-icons/fi";

import { toast } from "react-hot-toast"; // Optional: for feedback
import { formatKST } from "../../utils/formatKST";

// Keys allowed for copying
const copyableKeys = ["phone", "bank", "bankAccount", "tetherAddress"];

const formatKey = (key) => key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

const ChatRoomPanel = ({
  whic,
  messages,
  user,
  navigate,
  newMessage,
  setNewMessage,
  setImage,
  image,
  isConnected,
  handleSendMessage,
  handleCloseChat,
  users,
  customer,
}) => {
  return (
    <div className="w-full max-w- bg-white shadow-lg rounded-lg flex flex-col overflow-hidden">
      <div className="w-full max-w-5xl flex bg-white shadow-lg rounded-lg flex-col md:flex-row overflow-hidden">
        {/* Chat Area */}
        <div className="w-full md:w-2/3 flex flex-col border-r border-gray-200">
          <div className="bg-green-800 text-white text-center py-2 px-6">
            <h1 className="text-lg md:text-xl font-semibold">Chatroom for Order: {whic}</h1>
          </div>

          <div className="flex-1 bg-white rounded-lg shadow-lg p-4 mb-3">
            <div className="h-[40vh] overflow-y-auto space-y-2 pr-2">
              {messages.map((message, index) => {
                const isUser = message.sender === user.nickname;

                return (
                  <div
                    key={index}
                    className={`flex flex-col ${isUser ? "justify-end" : "justify-start"} w-full`}
                  >
                    <div
                      className={`max-w-[80%] md:max-w-sm px-4 py-3 rounded-2xl text-sm shadow-md ${
                        isUser
                          ? "bg-green-500 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <div className="mb-1 bg-white/15 text-pink-700 text-lg font-bold opacity-80">
                        {message.sender}
                      </div>
                      <div className="break-words whitespace-pre-wrap mb-2">{message.content}</div>
                      {message.image && (
                        <img
                          src={message.image}
                          alt="Chat Media"
                          className="max-h-60 rounded-md border mt-2"
                        />
                      )}
                    </div>
                    {message.timestamp && (
                      <div className="text-[13px] font-semibold text-right mt-1 text-gray-600">
                        {formatKST(message.timestamp)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 cursor-pointer text-green-800 hover:text-green-700 font-bold px-4 py-1 rounded-lg transition duration-200"
            >
              <FiArrowLeft size={30} />
              <span>Go back to the previous page</span>
            </button>
          </div>
        </div>

        {/* Input & Controls */}
        <div className="w-full md:w-1/3 bg-gray-50 p-6 flex flex-col justify-between">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              rows={5}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
            <div className="flex absolute top-27 left-3 items-center justify-between">
              <label className="cursor-pointer inline-flex items-center gap-2 text-gray-600 hover:text-green-700">
                <FiImage size={27} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {image && (
            <div className="bg-black px-1 py-1 mb-20">
              <img src={URL.createObjectURL(image)} alt="Preview" className="max-h-60 rounded-md" />
            </div>
          )}

          <div className="mt-4 flex flex-col gap-3">
            <button
              onClick={handleSendMessage}
              disabled={!isConnected}
              className={`w-full py-3 cursor-pointer text-white font-semibold rounded-lg transition ${
                isConnected ? "bg-green-800 hover:bg-green-700" : "bg-green-300 cursor-not-allowed"
              }`}
            >
              Send
            </button>

            {user?.admin && (
              <button
                onClick={handleCloseChat}
                className="w-full py-3 bg-red-600 cursor-pointer hover:bg-red-700 text-white font-semibold rounded-lg transition"
              >
                Close Chat
              </button>
            )}
          </div>
        </div>
      </div>

      {/* User Data Summary */}
      <div className="px-2 py-2 rounded-2xl border-slate-400 text-sm border space-y-1 mt-4">
        <div className="w-full text-center flex justify-center -m-4 font-bold text-xl">
          <h2 className="bg-green-500 px-7 z-50 text-white py-1 rounded-2xl flex items-center gap-2">
            {customer === "Seller" ? (
              <>
                <FiUser size={26} className="text-white" />{" "}
                <span className="font-semibold">Seller</span>
              </>
            ) : (
              <>
                <FiShoppingBag size={26} className="text-white" />{" "}
                <span className="font-semibold">Buyer</span>
              </>
            )}
          </h2>
        </div>
        {Object.entries(users).map(([key, value]) => {
          const isCopyable = copyableKeys.includes(key);
          return (
            <div key={key} className="flex items-center justify-between gap-2">
              <p className="w-full">
                <strong>{formatKey(key)}:</strong> <span className="break-all">{value}</span>
              </p>
              {isCopyable && (
                <button
                  onClick={() => {
                    const formatted = `${users.bankAccount} ${users.bankName} ${users.fullName}`;
                    navigator.clipboard.writeText(formatted);
                    toast.success(`Copied as: ${formatted}`);
                  }}
                  title="Copy"
                  className="text-green-700 hover:text-green-900 cursor-pointer"
                >
                  <FiCopy size={18} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatRoomPanel;
