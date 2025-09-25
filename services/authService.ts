import type { LoginRequest } from "@/types";
import axios from "axios";

export const loginUser = async (loginRequest:LoginRequest)=>{
   const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/login`,loginRequest);
   return response.data;
}