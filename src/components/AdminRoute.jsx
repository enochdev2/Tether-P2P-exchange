// components/AdminRoute.js
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");


  const user = token ? JSON.parse(atob(token.split(".")[1])) : null;

  // If no user or not an admin, redirect
  if (!user || !user.admin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
