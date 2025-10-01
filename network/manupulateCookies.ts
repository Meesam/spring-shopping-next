"use server"

import {LoginResponse} from "@/types";
import {cookies} from "next/headers";

export const modifyCookiesAction = async (resp:LoginResponse)=>{
    debugger
    if(resp){
        (await cookies()).set('access_token', resp.accessToken, {
            httpOnly: true, // Prevents client-side JavaScript access
            secure: process.env.NODE_ENV === 'production', // Use 'secure' in production
            maxAge: 60, // 1 minute
            path: '/', // The path for which the cookie is valid
            sameSite: 'strict',
        });

        (await cookies()).set('refresh_token', resp.refreshToken, {
            httpOnly: true, // Prevents client-side JavaScript access
            secure: process.env.NODE_ENV === 'production', // Use 'secure' in production
            maxAge: 60 * 60 * 24 * 30, // 1 minute
            path: '/', // The path for which the cookie is valid
            sameSite: 'strict',
        });
        return {success:true};
    }else {
        (await cookies()).delete('access_token');
        (await cookies()).delete('refresh_token');
        return {success:true};
    }
}