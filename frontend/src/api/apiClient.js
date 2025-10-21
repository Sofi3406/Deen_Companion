import axios from "axios";
import { getToken, logoutUser } from "../utils/auth";

// Create Axios instance with base URL and JSON header
const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Add request interceptor to inject token as Authorization Bearer token
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = getToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("Failed to get auth token", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error
      console.error("Network error: No response from server");
    } else {
      const { status } = error.response;

      // Handle unauthorized errors globally (e.g., token expired)
      if (status === 401) {
        console.warn("Unauthorized! Handling token expiry or logout...");
        // Optionally logout user or refresh token here:
        // logoutUser();
        // Or trigger a token refresh workflow
        // For now, just reject with message
        return Promise.reject("Unauthorized: Please login again.");
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
