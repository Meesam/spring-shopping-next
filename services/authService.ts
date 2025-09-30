"use server";

import {
    ActivateUserByOtpRequest, ChangePasswordRequest,
    ForgotPasswordRequest,
    LoginRequest,
    LoginResponse,
    NewOtpRequest, RefreshTokenRequest,
    RegisterRequest
} from "@/types";
import axios from "axios";
import {cookies} from "next/headers";

export const setCookies = async (data: LoginResponse) => {
    (await cookies()).set("access_token", data.accessToken, {
        httpOnly: false, secure: true, sameSite: "lax", path: "/",
        expires: new Date(data.accessTokenExpiresAt),
    });
    (await cookies()).set("refresh_token", data.refreshToken, {
        httpOnly: false, secure: true, sameSite: "lax", path: "/",
        expires: new Date(data.refreshTokenExpiresAt),
    });
}

export const removeCookies = async () => {
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');
}

const getRefreshToken = async () => {
    const cookieStore = await cookies()
    return cookieStore.get('refresh_token')?.value
}

export const loginUser = async (loginRequest: LoginRequest) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/login`, loginRequest);
        await setCookies(response.data)
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || error.message || "Login failed";
            throw new Error(message);
        }
        throw new Error("An unexpected error occurred during login");
    }
}

export const registerUser = async (registerRequest: RegisterRequest) => {
    try{
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/register`, registerRequest);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || error.message || "Registration failed";
            throw new Error(message);
        }
        throw new Error("An unexpected error occurred during registration");
    }
}

export const activateUserByOtp = async (activateUserByOtpRequest: ActivateUserByOtpRequest) => {
    try {
        let payload = {
            ...activateUserByOtpRequest,
            otp: Math.floor(Number(activateUserByOtpRequest.otp))
        }
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/activateUserByOtp`, payload);
        return response.data;
    }catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || error.message || "Activation is failed";
            throw new Error(message);
        }
        throw new Error("An unexpected error occurred during activation");
    }
}

export const logoutUser = async () => {
    try {
        const refreshToken= await getRefreshToken()
        await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/logout`,{token: refreshToken});
        await removeCookies()
        return true;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || error.message || "Logout failed";
            throw new Error(message);
        }
        throw new Error("An unexpected error occurred during logout");
    }
}

export const refreshToken = async (refreshTokenRequest:RefreshTokenRequest) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/refresh`,{refreshTokenRequest});
        await setCookies(response.data)
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || error.message || "Refresh token failed";
            throw new Error(message);
        }
    }
}

export const forgotPassword = async (forgotPasswordRequest: ForgotPasswordRequest) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/forgotPassword`, forgotPasswordRequest);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || error.message || "Forgot password failed";
            throw new Error(message);
        }
        throw new Error("An unexpected error occurred during forgotPassword");
    }
}

export const resetPassword = async (changePasswordRequest: ChangePasswordRequest) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/resetPassword`, changePasswordRequest);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || error.message || "Reset password failed";
            throw new Error(message);
        }
        throw new Error("An unexpected error occurred during changePassword");
    }
}

export const generateNewOtp = async (newOtpRequest: NewOtpRequest) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/generateNewOtp`, newOtpRequest);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || error.message || "Generate NewOtp failed";
            throw new Error(message);
        }
        throw new Error("An unexpected error occurred during changePassword");
    }
}
