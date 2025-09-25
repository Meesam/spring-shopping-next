import type { CategoryRequest } from "@/types";
import axios from "@/network/AxiosHandler";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export const fetchCategories = async () => {
  const response = await axios.get(`${BASE_API_URL}/category/all`);
  return response.data;
};

export const createCategory = async (categoryRequest: CategoryRequest) => {
  const response = await axios.post(
    `${BASE_API_URL}/category/create`,
    categoryRequest
  );
  return response.data;
};
