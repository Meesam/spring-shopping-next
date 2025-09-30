'use server'

import type { CategoryRequest } from "@/types";
import axios from "@/network/AxiosHandler";
import {serverFetch} from "@/network/serverFetcher";

const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export const fetchCategories = async () => {
    try {
        const response = await serverFetch('/category/getAll', { method: 'GET' });
        return response.json()
    }catch (e) {
      console.log(e)
    }
};

export const createCategory = async (categoryRequest: CategoryRequest) => {
    const response = await serverFetch('/category/create', { method: 'POST', body: JSON.stringify(categoryRequest) });
    return response.json();
};

export const deleteCategory = async (categoryId: number|null) => {

    const response = await serverFetch(`/category/delete?categoryId=${categoryId}`, { method: 'DELETE'});
    return response.json();
};
