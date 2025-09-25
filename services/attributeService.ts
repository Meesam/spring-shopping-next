import type { AttributeRequest } from "@/types";
import axios from "@/network/AxiosHandler";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export const fetchAllAttributes = async () => {
  const response = await axios.get(`${BASE_API_URL}/attribute/all`);
  return response.data;
};

export const createAttribute = async (attributeRequest: AttributeRequest) => {
  const response = await axios.post(
    `${BASE_API_URL}/attribute/create`,
    attributeRequest
  );
  return response.data;
};
