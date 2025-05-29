import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Get role directly from storage (no JWT)
  const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");

  if (!userRole) {
    // No role stored → not logged in
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    // Role not authorized
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized — render child components
  return children;
};

export default ProtectedRoute;
