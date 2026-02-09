import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import ChatRoomPanel2 from "../components/chat/ChatRoomPanel2";
import { useAuth } from "../utils/AuthProvider";
import { ErrorToast } from "../utils/Error";
import { SuccessToast } from "../utils/Success";

// const socket = io("http://localhost:3000", {
//   path: "/socket.io", // Ensure the path matches server-side configuration
//   withCredentials: true, // To handle cookies and CORS
// });

const ChatRoom3 = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { orderType, orderId, buyOrderId } = useParams();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messages2, setMessages2] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatUserInfo, setChatUserInfo] = useState([]);
  const [chatUserInfo2, setChatUserInfo2] = useState([]);
  const [newMessage2, setNewMessage2] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnected2, setIsConnected2] = useState(false);
  // const [userOrderId, setUserOrderId] = useState(null);
  const [image, setImage] = useState(null);
  const [image2, setImage2] = useState(null);
  const navigate = useNavigate();
  let whic = orderId.length > 5 ? orderId : orderType;
  const whi = orderType.length < 5 ? orderType : orderId;
  const buywhic = buyOrderId;
  const [userChatId, setUserChatId] = useState(whic);
  const [userChatId2, setUserChatId2] = useState(buywhic);
  // whic = whi === "buy" && orderId
  // const orderId = offerId;
  useEffect(() => {
    // const newSocket = io("http://localhost:3000", {
    const newSocket = io("https://tether-p2-p-exchang-backend.vercel.app", {
      path: "/socket.io",
      withCredentials: true,
    });

    setSocket(newSocket);

    fetchChatUserInfo();
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
  }, [whic]);

  const fetchMessages = async () => {
    const res = await fetch(
      `https://tether-p2-p-exchang-backend.vercel.app/api/v1/chat/admin/messages/end/${whic}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    if (!res.ok) {
      const data = await res.json();
      const errorMsg = data.error || data.message || "Failed to register user";
      ErrorToast(errorMsg);
    }
    setMessages(data.messages);
    
  };

  const fetchChatUserInfo = async () => {
    const res = await fetch(
      // `http://localhost:3000/api/v1/chat/admin/userInfo/${whic}`,
      `https://tether-p2-p-exchang-backend.vercel.app/api/v1/chat/admin/userInfo/${whic}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    if (!res.ok) {
      const data = await res.json();
      const errorMsg = data.error || data.message || "Failed to register user";
      ErrorToast(errorMsg);
    }
    setChatUserInfo(data);
    setUserChatId(data.nickname);
  };

  const handleCloseChat = async () => {
    socket.emit("closeChat", { whic });
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
    const ress = await handleCloseChat2();
    if (ress.ok && res.ok) {
      SuccessToast(t(messages.chatClosed));
      navigate("/admin/dashboard");
    }
    // Or navigate away:
  };

  //? .......BUYER................
  useEffect(() => {
    // const newSocket = io("http://localhost:3000", {
    const newSocket = io("https://tether-p2-p-exchang-backend.vercel.app", {
      path: "/socket.io",
      withCredentials: true,
    });

    setSocket(newSocket);

    fetchChatUserInfo2()
    fetchMessages2();

    newSocket.on("connect", () => {
      setIsConnected2(true);
      newSocket.emit("joinRoom", buywhic); // emit only after connect
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ Socket connect error:", err.message);
    });

    newSocket.on("message", (message2) => {
      setMessages2((prev) => [...prev, message2]);
    });

    return () => {
      newSocket.emit("leaveRoom", buywhic);
      newSocket.disconnect();
    };
  }, [buywhic]);

  const fetchMessages2 = async () => {
    const res = await fetch(
      `https://tether-p2-p-exchang-backend.vercel.app/api/v1/chat/admin/messages/end/${buywhic}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    if (!res.ok) {
      const data = await res.json();
      const errorMsg = data.error || data.message || "Failed to register user";
      ErrorToast(errorMsg);
    }
    setMessages2(data.messages);
  };

   const fetchChatUserInfo2 = async () => {
    const res = await fetch(
      // `http://localhost:3000/api/v1/chat/admin/userInfo/${buywhic}`,
      `https://tether-p2-p-exchang-backend.vercel.app/api/v1/chat/admin/userInfo/${buywhic}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    if (!res.ok) {
      const data = await res.json();
      const errorMsg = data.error || data.message || "Failed to register user";
      ErrorToast(errorMsg);
    }
    setChatUserInfo2(data);
    setUserChatId2(data.nickname);
  };

  const handleCloseChat2 = async () => {
    socket.emit("closeChat", { orderId });
    const res = await fetch(
      `https://tether-p2-p-exchang-backend.vercel.app/api/v1/chat/close/${buywhic}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const ress = await handleCloseChat();
    if (ress.ok && res.ok) {
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
  const readImageAsDataURL2 = (files, callback) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUrl = reader.result;
      callback(imageDataUrl);
    };
    reader.readAsDataURL(files);
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
  const dataURLtoBlob2 = (dataURL) => {
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
    <div className="min-h-screen mt-10 bg-gray-100 flex gap-6 items-center justify-center p-4">
      <ChatRoomPanel2
        whic={userChatId}
        messages={messages}
        user={user}
        navigate={navigate}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        setImage={setImage}
        image={image}
        isConnected={isConnected}
        // handleSendMessage={handleSendMessage}
        // handleCloseChat={handleCloseChat}
        users={chatUserInfo}
        customer={orderType === "sell" ? "Seller" : "Buyer"}
      />

      {/* second section */}
      <ChatRoomPanel2
        whic={userChatId2}
        messages={messages2}
        user={user}
        navigate={navigate}
        newMessage={newMessage2}
        setNewMessage={setNewMessage2}
        setImage={setImage2}
        image={image2}
        isConnected={isConnected2}
        // handleSendMessage={handleSendMessage2}
        // handleCloseChat={handleCloseChat2}
        users={chatUserInfo2}
        customer={orderType === "sell" ? "Buyer" : "Seller"}
      />
    </div>
  );
};

export default ChatRoom3;
