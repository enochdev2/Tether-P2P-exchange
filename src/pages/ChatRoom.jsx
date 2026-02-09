import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../utils/AuthProvider";
import { SuccessToast } from "../utils/Success";
import { FiArrowLeft, FiImage } from "react-icons/fi";
import { ErrorToast } from "../utils/Error";
import { useTranslation } from "react-i18next";
import InfoCard from "../components/InfoCard";
import { BanknoteIcon, PiggyBank, Wallet2Icon } from "lucide-react";

// const socket = io("http://localhost:3000", {
//   path: "/socket.io", // Ensure the path matches server-side configuration
//   withCredentials: true, // To handle cookies and CORS
// });

const ChatRoom = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { orderType, orderId } = useParams();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  // const [userOrderId, setUserOrderId] = useState(null);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const whic = orderId.length > 5 ? orderId : orderType;
  const whi = orderType.length < 5 ? orderType : orderId;
  // const orderId = offerId;
  useEffect(() => {
    // const newSocket = io("http://localhost:3000", {
    const newSocket = io("https://tether-p2-p-exchang-backend.vercel.app", {
      path: "/socket.io",
      withCredentials: true,
    });

    setSocket(newSocket);

    fetchMessages();

    newSocket.on("connect", () => {
      setIsConnected(true);
      newSocket.emit("joinRoom", whic); // emit only after connect
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ Socket connect error:", err.message);
    });

    newSocket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.emit("leaveRoom", orderId);
      newSocket.disconnect();
    };
  }, [orderId]);

  const fetchMessages = async () => {
    const res = await fetch(
      `https://tether-p2-p-exchang-backend.vercel.app/api/v1/chat/messages/${whic}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    setMessages(data);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() || image) {
      const message = { sender: user.nickname, content: newMessage, orderId };

      const token = localStorage.getItem("token");

      // socket.emit("sendMessage", message);

      const messageData = {
        content: newMessage ? newMessage : "Image",
        sender: user.nickname,
        orderId: orderId,
        orderType: orderType, // Pass orderType as well
        timestamp: new Date().toISOString(),
      };
      let base64Image = null;

      const commonMessageData = {
        content: newMessage ? newMessage : "Image",
        sender: user.nickname,
        orderId: whic,
        orderType: whi,
        timestamp: new Date().toISOString(),
      };

      // Reset UI state early to avoid residual image
      setNewMessage("");

      if (image) {
        readImageAsDataURL(image, async (imageDataUrl) => {
          const blobImage = dataURLtoBlob(imageDataUrl);

          // Validate file type
          if (!blobImage.type.includes("image/")) {
            ErrorToast("Please upload a valid image file.");
            return;
          }

          // Validate size (max 5MB)
          if (blobImage.size > 5 * 1024 * 1024) {
            ErrorToast("Image size must be less than 5MB.");
            return;
          }

          // Send base64 (still not ideal, but validated)
          const messageData = {
            ...commonMessageData,
            image: imageDataUrl, // This is safe and smaller now
          };

          socket.emit("sendMessage", messageData);

          // "http://localhost:3000/api/v1/chat",
          await fetch(
            "https://tether-p2-p-exchang-backend.vercel.app/api/v1/chat",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(messageData),
            }
          );

          setImage(null); // Clear image after sending
        });
      } else {
        const messageData = {
          ...commonMessageData,
          image: null,
        };

        socket.emit("sendMessage", messageData);

        // "http://localhost:3000/api/v1/chat",
        await fetch(
          "https://tether-p2-p-exchang-backend.vercel.app/api/v1/chat",
           {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageData),
        });
      }
      // setNewMessage("");
    }
  };

  const handleCloseChat = async () => {
    socket.emit("closeChat", { orderId });
    const res = await fetch(
      `https://tether-p2-p-exchang-backend.vercel.app/api/v1/chat/close/${whic}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (res.ok) {
      SuccessToast(t(messages.chatClosed));
      navigate("/admin/dashboard");
    }
    // Or navigate away:
  };

  const readImageAsDataURL = (file, callback) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUrl = reader.result;
      callback(imageDataUrl);
    };
    reader.readAsDataURL(file);
  };

  const dataURLtoBlob = (dataURL) => {
    const splitDataUrl = dataURL.split(",");
    const byteString = atob(splitDataUrl[1]);
    const mimeString = splitDataUrl[0].split(":")[1].split(";")[0];

    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString });
  };

  // Check if the user is authorized to access the chatroom
  // if (!userRole === 'admin' || !userOrderId === orderId) {
  return (
    <div className="min-h-screen mt-10 bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg flex flex-col md:flex-row overflow-hidden">
        {/* Chat Area */}
        <div className="w-full md:w-2/3 flex flex-col border-r border-gray-200">
          <div className="bg-green-800 text-white text-center py-4 px-6">
            <h1 className="text-xl md:text-2xl font-semibold">Chatroom for Order: {whic}</h1>
          </div>

          {/* Messages */}
          <div className="flex-1 bg-white rounded-lg shadow-lg p-4 mb-6">
            <div className="h-[60vh] overflow-y-auto space-y-3 pr-2">
              {messages.map((message, index) => {
                const isUser = message.sender === user.nickname;

                return (
                  <div
                    key={index}
                    className={`flex ${isUser ? "justify-end" : "justify-start"} w-full`}
                  >
                    <div
                      className={`max-w-[80%] md:max-w-sm px-4 py-3 rounded-2xl text-sm shadow-md ${
                        isUser
                          ? "bg-green-500 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <div className=" mb-1 bg-white/15 text-pink-700 text-lg font-bold  opacity-80">
                        {message.sender}
                      </div>

                      {/* TEXT MESSAGE */}
                      <div className="break-words whitespace-pre-wrap mb-2">{message.content}</div>

                      {/* IMAGE MESSAGE */}
                      {message.image && (
                        <img
                          src={message.image}
                          alt="Chat Media"
                          className="max-h-60 rounded-md border mt-2"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 cursor-pointer text-green-800 hover:text-green-700 font-bold px-4 py-2 rounded-lg transition duration-200"
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
                {/* <span className="text-sm">Upload Image</span> */}
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
                className="w-full py-3 bg-red-600 cursor-pointer  hover:bg-red-700 text-white font-semibold rounded-lg transition"
              >
                Close Chat
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
