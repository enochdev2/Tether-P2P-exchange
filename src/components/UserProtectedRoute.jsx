// components/UserProtectedRoute.js
import { Navigate } from "react-router-dom";

const UserProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // Optionally decode to check user role
//   const user = JSON.parse(atob(token.split(".")[1])); 
//   if (user.admin || !user.admin) {
//     return <Navigate to="/signin" replace />;
//   }

  return children;
};

export default UserProtectedRoute;
