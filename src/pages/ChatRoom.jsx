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
    const res = await fetch(`https://tether-p2p-exchang-backend.onrender.com/api/v1/chat/messages/${orderId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
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

      const res = await fetch("https://tether-p2p-exchang-backend.onrender.com/api/v1/chat", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messageData),
  });
      console.log("🚀 ~ handleSendMessage ~ res:", res)
      setNewMessage("");
    }
  };


  const handleCloseChat = async () => {
  socket.emit("closeChat", { orderId });
  const res = await fetch(`https://tether-p2p-exchang-backend.onrender.com/api/v1/chat/close/${orderId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if(res.ok){
    SuccessToast("Chat closed successfully.");
    navigate("/admin/dashboard");
  }
  // Or navigate away:
};


  // Check if the user is authorized to access the chatroom
  // if (!userRole === 'admin' || !userOrderId === orderId) {
  return (
    <div className=" justify-center items-center h-screen p-6  bg-gray-100">
      <div className="w-5xl md:w-6xl h-[70vh] m-auto mt-30 ">
        <h1 className="text-3xl font-semibold text-center text-green-600 mb-6">
          Chatroom for Order: {orderId}
        </h1>
        <div className=" flex flex-wrap p-4">
          <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-lg p-4 md:h-[60vh] space-y-4 mb-6">
            {messages.map((message, index) => {
              const isUser = message.sender === user.nickname;

              return (
                <div
                  key={index}
                  className={`flex ${
                    isUser ? "justify-end" : "justify-start"
                  } mb-2`}
                >
                  <div
                    className={`max-w-xs md:max-w-md p-3 rounded-lg shadow-sm ${
                      isUser
                        ? "bg-blue-100 text-blue-800 self-end text-right"
                        : "bg-gray-200 text-gray-700 self-start text-left"
                    }`}
                  >
                    <div className="text-sm font-semibold mb-1">
                      {message.sender}
                    </div>
                    <div>{message.content}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message input area */}
          <div className="w-1/3 flex flex-col justify-end p-4 space-y-4">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
            <button
              onClick={handleSendMessage}
              disabled={!isConnected}
              className={`px-6 py-3 rounded-lg transition-colors cursor-pointer text-white ${
                isConnected
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-green-300 cursor-not-allowed"
              }`}
            >
              Send
            </button>
            {user?.admin && (
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleCloseChat}
                  className="bg-red-600 hover:bg-red-700 cursor-pointer text-white font-semibold px-4 py-2 rounded-lg shadow"
                >
                  Close Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // } else {
  //   return (
  //     <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
  //       <h2 className="text-2xl font-semibold text-red-500">You are not authorized to view this chatroom</h2>
  //     </div>
  //   );
  // }
};

export default ChatRoom;
