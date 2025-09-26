import type { LoginResponse } from "@/types";
import axios from "axios";
const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Check if the error is 401 and not already retried
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh token
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post(`${BASE_API_URL}/auth/refresh`, {
          token: refreshToken,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization':''
          }
        });
        const user = res.data as LoginResponse;

          localStorage.setItem("accessToken", user.accessToken);
          localStorage.setItem("accessTokenExpiresAt", user.accessTokenExpiresAt);
          localStorage.setItem("refreshToken", user.refreshToken);
          localStorage.setItem("refreshTokenExpiresAt", user.refreshTokenExpiresAt);
          localStorage.setItem("user", JSON.stringify(user.user));

        // Update Authorization header and retry original request
        originalRequest.headers.Authorization = `Bearer ${user.accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Handle refresh failure (e.g., logout user)
        localStorage.removeItem("accessToken");
        localStorage.removeItem("accessTokenExpiresAt");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("refreshTokenExpiresAt");
          localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

axios.interceptors.request.use(
  (config) => {
   const token = localStorage.getItem("accessToken"); // Or use your preferred storage
    if (token && config.url && !config.url.includes('/auth')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axios;
