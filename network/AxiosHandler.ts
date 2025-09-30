import {LoginResponse, RefreshTokenRequest} from "@/types";
import axios from "axios";
import {deleteCookie, getCookie, setCookie} from 'cookies-next';

const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

const getRefreshAuthToken = () => {
    return getCookie('refresh_token')
}

const getAccessToken = () => {
    return getCookie('access_token');
}

const setCookies = (data: LoginResponse) => {
    setCookie('access_token', data.accessToken, {
        maxAge: 60,
        path: '/', // Set access token globally
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
     setCookie('refresh_token', data.accessToken, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/', // Set access token globally
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
}

const removeCookies = () => {
     deleteCookie('access_token');
     deleteCookie('refresh_token', {path: '/'});
}

export const refreshToken = async (refreshTokenRequest: RefreshTokenRequest) => {
    debugger
    //try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/refresh`, refreshTokenRequest);
    return response.data;
    //} catch (error) {
    //if (axios.isAxiosError(error)) {
    // const message = error.response?.data?.message || error.message || "Refresh token failed";
    // throw new Error(message);
    //}
    // }
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
            (typeof error.response.data === "object" ? error.response.data.message === "Refresh token is expired" : error.response.data === "Invalid or expired token") &&
            !originalRequest.url.includes('/auth/refresh')
        ) {
            // Prevent infinite loop if the retry attempt also fails with 401
            if (originalRequest._retry) {
                // Log out or redirect to log in
                removeCookies()
                window.location.href = "/login";
                return Promise.reject(error);
            }
            originalRequest._retry = true;
            try {
                // Attempt to refresh a token
                const refToken = await getCookie('refresh_token')
                if (refToken === "") {
                    // No refresh token, can't retry. Log out/redirect.
                    //window.location.href = "/login";
                    return Promise.reject(error);
                }
                try {
                    const res = await refreshToken({token: refToken?.toString() || ""})
                    const user = res as LoginResponse;
                    setCookies(user)
                    //localStorage.setItem("user", JSON.stringify(user.user));

                    // Update Authorization header and retry original request
                    originalRequest.headers.Authorization = `Bearer ${user.accessToken}`;
                } catch (e) {
                    removeCookies();
                    //window.location.href = "/login";
                    return Promise.reject(e);
                }

                return axios(originalRequest);
            } catch (refreshError) {
                // Handle refresh failure (e.g., logout user)
                // await removeCookies();
                //window.location.href = "/login";
                removeCookies();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

axios.interceptors.request.use(
    async (config) => {
        const token = getAccessToken();
        if (token && config.url && !config.url.includes('/auth')) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axios;
