import axios from "axios";
import { useAuthStore } from "@/store/use-auth-store";

const isDev = import.meta.env.DEV;

// Use relative path in development (so Vite proxy works)
// Use full URL in production
const BASE_URL = isDev
  ? "/api"
  : import.meta.env.VITE_API_BASE_URL || "http://jadal-platform.com/api";

const WITH_CREDENTIALS = import.meta.env.VITE_API_WITH_CREDENTIALS === "true";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: WITH_CREDENTIALS,
});

// Request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default api;
