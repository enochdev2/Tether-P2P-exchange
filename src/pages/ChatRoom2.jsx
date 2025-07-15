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
import ChatRoomPanel from "../components/chat/ChatRoomPanel";

// const socket = io("http://localhost:3000", {
//   path: "/socket.io", // Ensure the path matches server-side configuration
//   withCredentials: true, // To handle cookies and CORS
// });

const ChatRoom2 = () => {
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
  const [userInfo, setUserInfo] = useState(true);
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
    const newSocket = io("https://tether-p2p-exchang-backend.onrender.com", {
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

  const handleSendMessage = async () => {
    if (newMessage.trim() || image) {
      const message = { sender: user.nickname, content: newMessage, whic };

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
        currentOrderInProgress: buywhic,
        orderType: whi === "sell" ? "sell" : "buy",
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

          await fetch("https://tether-p2p-exchang-backend.onrender.com/api/v1/chat", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(messageData),
          });

          setImage(null); // Clear image after sending
        });
      } else {
        const messageData = {
          ...commonMessageData,
          image: null,
        };

        socket.emit("sendMessage", messageData);

        await fetch("https://tether-p2p-exchang-backend.onrender.com/api/v1/chat", {
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

  const fetchMessages = async () => {
    const res = await fetch(
      `https://tether-p2p-exchang-backend.onrender.com/api/v1/chat/admin/messages/${whic}`,
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
    // setChatUserInfo(data.chatDetails);
    // setUserChatId(data.chatDetails.nickname);
  };

  const fetchChatUserInfo = async () => {
    const res = await fetch(
      // `http://localhost:3000/api/v1/chat/admin/userInfo/${whic}`,
      `https://tether-p2p-exchang-backend.onrender.com/api/v1/chat/admin/userInfo/${whic}`,
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
      `https://tether-p2p-exchang-backend.onrender.com/api/v1/chat/close/${whic}`,
      // `http://localhost:3000/api/v1/chat/close/${whic}`,
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

  //? .......BUYER................
  useEffect(() => {
    // const newSocket = io("http://localhost:3000", {
    const newSocket = io("https://tether-p2p-exchang-backend.onrender.com", {
      path: "/socket.io",
      withCredentials: true,
    });

    setSocket(newSocket);

    fetchChatUserInfo2();

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
      `https://tether-p2p-exchang-backend.onrender.com/api/v1/chat/admin/messages/${buywhic}`,
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
    // setChatUserInfo2(data.chatDetails);
    // setUserChatId2(data.chatDetails.nickname);
  };

  const fetchChatUserInfo2 = async () => {
    const res = await fetch(
      // `http://localhost:3000/api/v1/chat/admin/userInfo/${buywhic}`,
      `https://tether-p2p-exchang-backend.onrender.com/api/v1/chat/admin/userInfo/${buywhic}`,
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

  const handleSendMessage2 = async () => {
    if (newMessage2.trim() || image2) {
      const message = { sender: user.nickname, content: newMessage, buywhic };

      const token = localStorage.getItem("token");

      // socket.emit("sendMessage", message);

      let base64Image = null;

      const commonMessageData = {
        content: newMessage2 ? newMessage2 : "Image",
        sender: user.nickname,
        orderId: buywhic,
        currentOrderInProgress: whic,
        orderType: whi === "sell" ? "buy" : "sell",
        timestamp: new Date().toISOString(),
      };

      // Reset UI state early to avoid residual image
      setNewMessage2("");

      if (image2) {
        readImageAsDataURL2(image2, async (imageDataUrl) => {
          const blobImage = dataURLtoBlob2(imageDataUrl);

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

          // await fetch("http://localhost:3000/api/v1/chat", {
          await fetch("https://tether-p2p-exchang-backend.onrender.com/api/v1/chat", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(messageData),
          });

          setImage(null); // Clear image after sending
        });
      } else {
        const messageData = {
          ...commonMessageData,
          image: null,
        };

        socket.emit("sendMessage", messageData);

        // await fetch("http://localhost:3000/api/v1/chat", {
        await fetch("https://tether-p2p-exchang-backend.onrender.com/api/v1/chat", {
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

  const handleCloseChat2 = async () => {
    socket.emit("closeChat", { orderId });
    const res = await fetch(
      `https://tether-p2p-exchang-backend.onrender.com/api/v1/chat/close/${buywhic}`,
      // `http://localhost:3000/api/v1/chat/close/${buywhic}`,
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
      <ChatRoomPanel
        whic={userChatId}
        messages={messages}
        user={user}
        navigate={navigate}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        setImage={setImage}
        image={image}
        isConnected={isConnected}
        handleSendMessage={handleSendMessage}
        // handleCloseChat={ () => {handleCloseChat(),handleCloseChat2()} }
        handleCloseChat={() => {
          handleCloseChat();
          handleCloseChat2();
        }}
        users={chatUserInfo}
        customer={orderType === "sell" ? "Seller" : "Buyer"}
      />

      {/* second section */}
      <ChatRoomPanel
        whic={userChatId2}
        messages={messages2}
        user={user}
        navigate={navigate}
        newMessage={newMessage2}
        setNewMessage={setNewMessage2}
        setImage={setImage2}
        image={image2}
        isConnected={isConnected2}
        handleSendMessage={handleSendMessage2}
        // handleCloseChat={handleCloseChat2}
        handleCloseChat={() => {
          handleCloseChat();
          handleCloseChat2();
        }}
        users={chatUserInfo2}
        customer={orderType === "sell" ? "Buyer" : "Seller"}
      />
    </div>
  );
};

export default ChatRoom2;

// {userInfo && (
//       <div className="mr-5 bg-slate-300 px-2 rounded-lg">
//         <div className="flex flex-col gap-4 w-full lg:space-x-6 my-4 overflow-x-auto sm:overflow-visible">
//           <div className="min-w-[280px]  sm:min-w-0 flex-1">
//             <InfoCard
//               icon={<PiggyBank size={24} />}
//               title={t("profile.bankName")}
//               actionText={user?.bankName}
//               onAction={() => console.log("Navigate to security questions")}
//               copyToClipboard={() => copyToClipboard(user?.bankName, "Bank Name")}
//             />
//           </div>
//           <div className="min-w-[280px] sm:min-w-0 flex-1">
//             <InfoCard
//               icon={<BanknoteIcon size={24} />}
//               title={t("profile.bankAccountNumber")}
//               actionText={user?.bankAccount}
//               copyToClipboard={() => copyToClipboard(user?.bankAccount, "Bank Account Number")}
//               onAction={() => console.log("Navigate to security questions")}
//             />
//           </div>

//           <div className="min-w-[280px]  sm:min-w-0 flex-1">
//             <InfoCard
//               className=""
//               icon={<Wallet2Icon size={24} />}
//               title={tether.slice(0, 15)}
//               actionText={tether.slice(15, 60)}
//               copyToClipboard={() => copyToClipboard(tether, "Tether Wallet")}
//             />
//           </div>
//         </div>
//         <div className="flex w-full justify-end">
//           <button
//             onClick={hanleToggleUserInfo}
//             className="  bg-red-600 px-2 text-lg rounded-lg text-yellow-50 cursor-pointer font-bold"
//           >
//             X
//           </button>
//         </div>
//       </div>
//     )}
