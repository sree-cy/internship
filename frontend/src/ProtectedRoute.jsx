import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute component:
 * Checks if a valid JWT token exists in localStorage.
 * If not authenticated, redirects user to /login and saves destination in location state.
 */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("prepgoToken");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
