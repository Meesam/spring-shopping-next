"use server";

import type {LoginRequest, LoginResponse} from "@/types";
import axios from "axios";
import {cookies} from "next/headers";

const setCookies = async (data:LoginResponse)=>{
     (await cookies()).set("access_token", data.accessToken, {
         httpOnly: true, secure: true, sameSite: "lax", path: "/",
         expires: new Date(data.accessTokenExpiresAt),
     });
     (await cookies()).set("refresh_token", data.refreshToken, {
         httpOnly: true, secure: true, sameSite: "lax", path: "/",
         expires: new Date(data.refreshTokenExpiresAt),
     });
 }

export const loginUser = async (loginRequest:LoginRequest)=>{
   const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/login`,loginRequest);
   await setCookies(response.data)
   return response.data;
}