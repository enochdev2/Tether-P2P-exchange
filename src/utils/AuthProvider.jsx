import React, { createContext, useState, useContext, useEffect } from "react";
import { ErrorToast } from "./Error";

// Create the context
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component to wrap around your app
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // State to hold user data
  const [priceKRW, setPriceKRW] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchPrice();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

    if (storedUser && storedIsLoggedIn === "true") {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const fetchPrice = async () => {
    try {
      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/tetherprice/get-tether-price",
        {
          method: "GET",
          headers: {
            // Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch tether price");
      }
      const data = await response.json();
      setPriceKRW(data.data);
      return response;
    } catch (err) {
      console.log(err.message);
    }
  };

  const login = async (userData) => {
    try {
      // const response = await fetch("http://localhost:3000/api/v1/user/login",
      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/user/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
          credentials: "include",
        }
      );
      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || data.message || "Failed to register user";
        ErrorToast(errorMsg);
        //  return response;
      }

      localStorage.setItem("token", data.token);

      setIsLoggedIn(true);
      setUser(data.user);

      // Save user data to localStorage (could be just user object or a token)
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isLoggedIn", "true");
      return data;
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  // Handle logout
  const logout = async () => {
    try {
      localStorage.removeItem("token");
      // Clear localStorage on logout
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      // const response = await fetch("http://localhost:5173/api/v1/user/logout", {
      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/user/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );
      localStorage.removeItem("token");

      if (!response.ok) {
        throw new Error("Failed to log out");
      }

      setIsLoggedIn(false);
      setUser(null);

      return response;
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // "http://localhost:3000/api/v1/user/users",
  const signUp = async (newUser) => {
    try {
      // const response = await fetch("
      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/user/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser), // Sending the new user data to the backend
        }
      );
      const data = await response.json();

      // Check if the response is successful
      if (!response.ok) {
        const errorMsg = data.error || data.message || "Failed to register user";
        ErrorToast(errorMsg);
      }

      setUser(data);
      localStorage.setItem("user", JSON.stringify(data)); // Store in localStorage

      console.log("User successfully registered:", data);

      return response;
    } catch (error) {
      console.error("Error during sign-up:", error);
      // Handle any errors (e.g., show an error message)
    }
  };

  const allUser = async () => {
    try {
      // const response = await fetch("http://localhost:5173/api/v1/user/users", {
      const response = await fetch(
        "https://tether-p2p-exchang-backend.onrender.com/api/v1/user/users",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();

      return data; // return parsed user data
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const updateUser = async (updatedData) => {
    try {
      const token = localStorage.getItem("token");
      // `http://localhost:3000/api/v1/user/users/${updatedData.nickname}`,
      const response = await fetch(
        `https://tether-p2p-exchang-backend.onrender.com/api/v1/user/users/${updatedData.nickname}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          // credentials: "include",
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        const errorMsg = data.error || data.message || "Failed to register user";
        ErrorToast(errorMsg);
      }

      const data = await response.json();

      return data; // Return updated user data
    } catch (error) {
      console.error("Error during user update:", error);
    }
  };
 

  // utils/auth.js
  const isTokenExpired = (token) => {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiry = payload.exp; // in seconds
      const now = Date.now() / 1000; // in seconds

      return expiry < now;
    } catch (error) {
      console.log("🚀 ~ isTokenExpired ~ error:", error)
      return true; // invalid token
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        signUp,
        setIsLoggedIn,
        setUser,
        updateUser,
        allUser,
        priceKRW,
        setPriceKRW,
        fetchPrice,
        notifications,
        setNotifications,
        isTokenExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
