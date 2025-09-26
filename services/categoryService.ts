'use server'

import type { CategoryRequest } from "@/types";
import axios from "@/network/AxiosHandler";
import {cookies} from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

const getAuthToken = async ()=> {
    const cookieStore = await cookies()
    return cookieStore.get('access_token')?.value
}


const serverAxios = axios.create({
    baseURL: BASE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})


export const fetchCategories = async () => {
    try {
        const token = await getAuthToken()
        const response = await serverAxios.get(`${BASE_API_URL}/category/getAll`,{
            headers: {
                'Authorization' : `Bearer ${token}`
            },
        });
        return response.data;
    }catch (e) {
      console.log(e)
    }
};

export const createCategory = async (categoryRequest: CategoryRequest) => {
    const token = await getAuthToken()
    const response = await serverAxios.post(
    `${BASE_API_URL}/category/create`,
    categoryRequest,{
          headers: {
              'Authorization' : `Bearer ${token}`
          },
      }
  );
  return response.data;
};

export const deleteCategory = async (categoryId: number|null) => {
    const token = await getAuthToken()
    const response = await serverAxios.delete(
        `${BASE_API_URL}/category/delete?categoryId=${categoryId}`,{
            headers: {
                'Authorization' : `Bearer ${token}`
            },
        }
    );
    return response.data;
};
