import { useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000"); // Your server's URL

export const useSocketNotification = ({ userId, role }) => {
  useEffect(() => {
    //  const newSocket = io("https://tether-p2p-exchang-backend.onrender.com", {
    //       path: "/socket.io",
    //       withCredentials: true,
    //     });
    socket.emit("registerUser", { userId, role });

    socket.on("notification", (data) => {
      console.log("🔔 Notification received:", data.message);

      // Play sound or show a toast, etc.
      const audio = new Audio("/notification.mp3");
      audio.play();
    });

    return () => socket.off("notification");
  }, [userId, role]);
};


// After successful registration (e.g., in your register handler on frontend)
// useSocketNotification({ userId: newUser._id, role: "user" });
