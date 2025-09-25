import type { LoginResponse } from "@/types";
import axios from "axios";
const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Check if error is 401 and not already retried
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh token
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post(`${BASE_API_URL}/auth/refresh-token`, {
          token: refreshToken,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization':''
          }
        });
        const user = res.data as LoginResponse;

        localStorage.setItem("token", user.token);
        localStorage.setItem("refreshToken", user.refreshToken);
        localStorage.setItem("user", JSON.stringify(user.user));

        // Update Authorization header and retry original request
        originalRequest.headers.Authorization = `Bearer ${user.token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Handle refresh failure (e.g., logout user)
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

axios.interceptors.request.use(
  (config) => {
   const token = localStorage.getItem("token"); // Or use your preferred storage
    if (token && config.url && !config.url.includes('/auth')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axios;