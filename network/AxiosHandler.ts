"use server"

import type { LoginResponse } from "@/types";
import axios from "axios";
import {cookies} from "next/headers";
import {refreshToken, removeCookies, setCookies} from "@/services/authService";

const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

const getRefreshAuthToken = async ()=> {
    const cookieStore = await cookies()
    return cookieStore.get('refresh_token')?.value
}

const getAccessToken = async () => {
    const cookieStore = await cookies()
    return cookieStore.get('access_token')?.value
}

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    debugger
      const originalRequest = error.config;
    // Check if the error is 401 and not already retried
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      //originalRequest._retry = true;
      try {
        // Attempt to refresh a token
        const refToken = await getRefreshAuthToken() || ""
        const res = await refreshToken({token: refToken})
        const user = res.data as LoginResponse;
          //localStorage.setItem("user", JSON.stringify(user.user));

        // Update Authorization header and retry original request
        originalRequest.headers.Authorization = `Bearer ${user.accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Handle refresh failure (e.g., logout user)
        await removeCookies();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

axios.interceptors.request.use(
 async (config) => {
   const token = await getAccessToken();
    if (token && config.url && !config.url.includes('/auth')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axios;
