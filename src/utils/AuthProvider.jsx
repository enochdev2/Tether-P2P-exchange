// src/context/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from "react";

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
  // console.log("🚀 ~ AuthProvider ~ user:", user);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

    if (storedUser && storedIsLoggedIn === "true") {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const login = async (userData) => {
    try {
      // const response = await fetch("https://tether-p2p-exchang-backend.onrender.com/api/v1/user/login", {
        const response = await fetch("http://localhost:3000/api/v1/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to log in");
      }

      const data = await response.json();
         localStorage.setItem("token", data.token);
         console.log("checking it out", data.token);
         
      setIsLoggedIn(true);
      setUser(data.user);

      // Save user data to localStorage (could be just user object or a token)
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isLoggedIn", "true");

      console.log("User successfully logged in", data);
      return response;
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  // Handle logout
  const logout = async () => {
    try {
      // const response = await fetch("http://localhost:5173/api/v1/user/logout", {
      const response = await fetch("https://tether-p2p-exchang-backend.onrender.com/api/v1/user/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to log out");
      }

      setIsLoggedIn(false);
      setUser(null);

      // Clear localStorage on logout
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");

      console.log("User successfully logged out");
      return response;
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const signUp = async (newUser) => {
    try {
      // Send the POST request to your API
      // const response = await fetch("http://localhost:5173/api/v1/user/users", {
      const response = await fetch("https://tether-p2p-exchang-backend.onrender.com/api/v1/user/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser), // Sending the new user data to the backend
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error("Failed to register user");
      }

      // If the registration is successful, update the state
      const data = await response.json();
      console.log("User successfully registered", data);
      return response;
    } catch (error) {
      console.error("Error during sign-up:", error);
      // Handle any errors (e.g., show an error message)
    }
  };

  const allUser = async () => {
    try {
      // const response = await fetch("http://localhost:5173/api/v1/user/users", {
      const response = await fetch("https://tether-p2p-exchang-backend.onrender.com/api/v1/user/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      console.log("Users fetched successfully 12345667", data);
      return data; // return parsed user data
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const updateUser = async (updatedData) => {
    try {
      const response = await fetch(
        // `http://localhost:5173/api/v1/user/users/${updatedData.nickname}`,
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
        throw new Error("Failed to update user");
      }

      const data = await response.json();

      console.log("User successfully updated", data);
      return data; // Return updated user data
    } catch (error) {
      console.error("Error during user update:", error);
      // Handle error, e.g., show error message to user
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
