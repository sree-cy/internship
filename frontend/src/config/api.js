/**
 * PrepGo Centralized API Configuration
 * Reads production backend URL from VITE_API_BASE_URL or defaults to localhost:5000 in development.
 */
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Ensure no trailing slash
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/api/auth`,
  APTITUDE: `${API_BASE_URL}/api/aptitude`,
  DSA: `${API_BASE_URL}/api/dsa`,
  HEALTH: `${API_BASE_URL}/api/health`,
};

/**
 * Returns Authorization header with JWT token if available.
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem("prepgoToken");
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : {
        "Content-Type": "application/json",
      };
};

export default API_BASE_URL;
