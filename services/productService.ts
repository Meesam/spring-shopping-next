import type { ProductImageRequest, ProductRequest } from "@/types";
import axios from "@/network/AxiosHandler";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export const fetchAllProducts = async () => {
  const response = await axios.get(`${BASE_API_URL}/product/all`);
  return response.data;
};

export const createProduct = async (productRequest: ProductRequest) => {
  const response = await axios.post(
    `${BASE_API_URL}/product/create`,
    productRequest
  );
  return response.data;
};

export const fetchProductById = async (id: string) => {
  const response = await axios.get(`${BASE_API_URL}/product/get-product-by-id?id=${id}`);
  return response.data;
}

export const uploadProductImage = async (productImageRequest:ProductImageRequest) => {
 const formData = new FormData();
  formData.append("file", productImageRequest.file);
  formData.append("productId", productImageRequest.productId);
  const response = await axios.post(
    `${BASE_API_URL}/product/addImage`,
    formData
  );
  return response.data;

}
