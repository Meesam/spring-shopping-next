import type { CategoryRequest } from "@/types";
import axios from "@/network/AxiosHandler";

const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export const fetchCategories = async () => {
  const response = await axios.get(`${BASE_API_URL}/category/getAll`);
  return response.data;
};

export const createCategory = async (categoryRequest: CategoryRequest) => {
  const response = await axios.post(
    `${BASE_API_URL}/category/create`,
    categoryRequest
  );
  return response.data;
};
