'use server'

import type { CategoryRequest } from "@/types";
import axios from "@/network/AxiosHandler";

const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export const fetchCategories = async () => {
    try {
        const response = await axios.get(`${BASE_API_URL}/category/getAll`);
        return response.data;
    }catch (e) {
      console.log(e)
    }
};

export const createCategory = async (categoryRequest: CategoryRequest) => {
    const response = await axios.post(`${BASE_API_URL}/category/create`, categoryRequest);
    return response.data;
};

export const deleteCategory = async (categoryId: number|null) => {
    const response = await axios.delete(
        `${BASE_API_URL}/category/delete?categoryId=${categoryId}`);
    return response.data;
};
