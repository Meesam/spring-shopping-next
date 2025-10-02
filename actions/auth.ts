// actions/auth.ts
"use server";

import { cookies } from "next/headers";
import {LoginResponse} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;


/**
 * Attempts to renew tokens using the existing refresh_token cookie.
 * If successful, modifies the cookies to set the new tokens.
 */
export async function renewTokensAction(): Promise<{ success: boolean; message: string, newAccessToken:string  }> {
    const refresh_token = (await cookies()).get('refresh_token')?.value;

    // 1. Check if the Refresh Token exists
    if (!refresh_token) {
        // If no refresh token, the user must log in again
        return { success: false, message: "No refresh token available. Please log in.", newAccessToken:"" };
    }

    try {
        // 2. CALL YOUR AUTH SERVICE API
        // This simulates an API call to exchange the refresh token for new tokens

        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: refresh_token }),
        });

        if (!response.ok) {
            // Token renewal failed (e.g., refresh token is also expired or invalid)
            // 3a. Clean up expired tokens before telling the client to log in
            (await cookies()).delete('access_token');
            (await cookies()).delete('refresh_token');
            return { success: false, message: "Refresh token failed. Please log in.", newAccessToken:"" };
        }

        const newTokens: LoginResponse = await response.json();

        // 3b. RENEWAL SUCCESS: Modify cookies with the new tokens

        // Update the Access Token (short-lived)
        (await cookies()).set('access_token', newTokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60, // e.g., 1 hour
            path: '/',
            sameSite: 'strict',
        });

        // Update the Refresh Token (long-lived, may not always be returned by API)
        (await cookies()).set('refresh_token', newTokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30, // e.g., 30 days
            path: '/',
            sameSite: 'strict',
        });

        return { success: true, message: "Tokens successfully renewed.", newAccessToken:newTokens.accessToken };

    } catch (error) {
        console.error("Token renewal error:", error);
        return { success: false, message: "A server error occurred during renewal.", newAccessToken : "" };
    }
}
