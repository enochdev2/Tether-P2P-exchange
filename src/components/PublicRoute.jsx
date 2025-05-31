// components/PublicRoute.js
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If user is logged in, redirect to dashboard
  if (token) {
    return <Navigate to="/dashboard/profile" replace />;
  }

  return children;
};

export default PublicRoute;
