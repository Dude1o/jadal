import { useAuthStore } from "@/store/use-auth-store";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const isDev = import.meta.env.DEV;

/**
 * Create Axios instance
 */
const BASE_URL = isDev
  ? "/api"
  : import.meta.env.VITE_API_URL || "http://jadal-platform.com/api";

export const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: !isDev,
});

/**
 * REQUEST INTERCEPTOR
 * - Attach auth token
 * - Normalize headers
 */
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * RESPONSE INTERCEPTOR
 * - Handle global errors
 * - Token refresh (optional pattern)
 */
http.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    // Example: handle 401 (unauthorized)
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        // OPTIONAL: refresh token flow
        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refresh_token: refreshToken },
        );

        const newToken = res.data.access_token;

        localStorage.setItem("token", newToken);

        // retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return http(originalRequest);
      } catch (refreshError) {
        // logout fallback
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");

        // optional: redirect
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    // Normalize error response
    return Promise.reject({
      message:
        (error.response?.data as any)?.message ||
        error.message ||
        "Something went wrong",
      status: error.response?.status,
      data: error.response?.data,
    });
  },
);
