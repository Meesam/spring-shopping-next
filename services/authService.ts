"use server";

import {
    ActivateUserByOtpRequest, ChangePasswordRequest,
    ForgotPasswordRequest,
    LoginRequest,
    LoginResponse,
    NewOtpRequest,
    RegisterRequest
} from "@/types";
import axios from "axios";
import {cookies} from "next/headers";

const setCookies = async (data: LoginResponse) => {
    (await cookies()).set("access_token", data.accessToken, {
        httpOnly: true, secure: true, sameSite: "lax", path: "/",
        expires: new Date(data.accessTokenExpiresAt),
    });
    (await cookies()).set("refresh_token", data.refreshToken, {
        httpOnly: true, secure: true, sameSite: "lax", path: "/",
        expires: new Date(data.refreshTokenExpiresAt),
    });
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
        await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/logout`);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || error.message || "Logout failed";
            throw new Error(message);
        }
        throw new Error("An unexpected error occurred during logout");
    }
}

export const refreshToken = async () => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/refresh`);
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
        }
    }
}

export const changePassword = async (changePasswordRequest: ChangePasswordRequest) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/changePassword`, changePasswordRequest);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || error.message || "Reset password failed";
        }
    }
}

export const generateNewOtp = async (newOtpRequest: NewOtpRequest) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/generateNewOtp`, newOtpRequest);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || error.message || "Generate NewOtp failed";
        }
    }
}
