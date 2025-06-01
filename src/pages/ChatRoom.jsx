import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../utils/AuthProvider";
import { SuccessToast } from "../utils/Success";

// const socket = io("http://localhost:3000", {
//   path: "/socket.io", // Ensure the path matches server-side configuration
//   withCredentials: true, // To handle cookies and CORS
// });

const ChatRoom = () => {
  const { user, setIsLoggedIn, setUser } = useAuth();
  console.log("🚀 ~ ChatRoom ~ user:", user);
  const { orderId } = useParams();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userOrderId, setUserOrderId] = useState(null);
  const navigate = useNavigate();

  const fetchMessages = async () => {
    const res = await fetch(
      `https://tether-p2p-exchang-backend.onrender.com/api/v1/chat/messages/${orderId}`,
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

  useEffect(() => {
    const newSocket = io("https://tether-p2p-exchang-backend.onrender.com", {
      path: "/socket.io",
      withCredentials: true,
    });

    setSocket(newSocket);

    fetchMessages();

    newSocket.on("connect", () => {
      console.log("✅ Socket connected");
      setIsConnected(true);
      newSocket.emit("joinRoom", orderId); // emit only after connect
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

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const message = { sender: user.nickname, content: newMessage, orderId };
      socket.emit("sendMessage", message); // Emit message to the server
      const messageData = {
        content: newMessage,
        sender: user.nickname,
        orderId,
        timestamp: new Date().toISOString(),
      };

      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/chat",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageData),
        }
      );
      console.log("🚀 ~ handleSendMessage ~ res:", res);
      setNewMessage("");
    }
  };

  const handleCloseChat = async () => {
    socket.emit("closeChat", { orderId });
    const res = await fetch(
      `https://tether-p2p-exchang-backend.onrender.com/api/v1/chat/close/${orderId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (res.ok) {
      SuccessToast("Chat closed successfully.");
      navigate("/admin/dashboard");
    }
    // Or navigate away:
  };

  // Check if the user is authorized to access the chatroom
  // if (!userRole === 'admin' || !userOrderId === orderId) {
  return (
    <div className="min-h-screen mt-10 bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg flex flex-col md:flex-row overflow-hidden">
        {/* Chat Area */}
        <div className="w-full md:w-2/3 flex flex-col border-r border-gray-200">
          <div className="bg-green-800 text-white text-center py-4 px-6">
            <h1 className="text-xl md:text-2xl font-semibold">
              Chatroom for Order: {orderId}
            </h1>
          </div>

          {/* Messages */}
          <div className="flex-1 bg-white rounded-lg shadow-lg p-4 mb-6">
            <div className="h-[60vh] overflow-y-auto space-y-3 pr-2">
              {messages.map((message, index) => {
                const isUser = message.sender === user.nickname;

                return (
                  <div
                    key={index}
                    className={`flex ${
                      isUser ? "justify-end" : "justify-start"
                    } w-full`}
                  >
                    <div
                      className={`max-w-[80%] md:max-w-sm px-4 py-3 rounded-2xl text-sm shadow-md ${
                        isUser
                          ? "bg-green-500 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <div className="font-semibold mb-1 text-xs opacity-80">
                        {message.sender}
                      </div>
                      <div className="break-words whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Input & Controls */}
        <div className="w-full md:w-1/3 bg-gray-50 p-6 flex flex-col justify-between">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              rows={5}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <button
              onClick={handleSendMessage}
              disabled={!isConnected}
              className={`w-full py-3 text-white font-semibold rounded-lg transition ${
                isConnected
                  ? "bg-green-800 hover:bg-green-700"
                  : "bg-green-300 cursor-not-allowed"
              }`}
            >
              Send
            </button>

            {user?.admin && (
              <button
                onClick={handleCloseChat}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
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
