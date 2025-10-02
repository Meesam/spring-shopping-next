import type { useMutation, UseMutationResult } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
    token:string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password:string;
}

export interface ChangePasswordRequest {
  email: string;
  newPassword:string;
}

export interface ActivateUserByOtpRequest {
  otp: string;
  email: string;
}

export interface NewOtpRequest{
  email:string;
}

export interface ForgotPasswordRequest{
  email:string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  profilePicUrl?: string;
  lastLoginAt?: string;
}

export interface LoginResponse {
    accessToken: string;
    accessTokenExpiresAt:string;
    refreshToken: string;
    refreshTokenExpiresAt:string;
    user: User;
}

export interface CategoryResponse {
  id: number;
  title: string;
  createdAt: string;
  isActive:boolean;
}

export interface CategoryRequest {
  title: string;
  id?:number;
}
export interface CategoryTableProps {
  data: CategoryResponse[];
  columns: ColumnDef<CategoryResponse>[];
  isPending: boolean;
}

export interface AttributeTableProps {
  data: AttributeResponse[];
  columns: ColumnDef<AttributeResponse>[];
  isPending: boolean;
}

export interface ProductTableProps {
  data: ProductResponse[];
  columns: ColumnDef<ProductResponse>[];
  isPending: boolean;
}

export interface AddCategoryProps {
  mutation: UseMutationResult<unknown, Error, CategoryRequest, unknown>;
  category?:CategoryRequest | undefined;
}

export interface AddAttributeProps {
  mutation: UseMutationResult<unknown, Error, AttributeRequest, unknown>;
}

export interface AddProductProps {
  mutation: UseMutationResult<unknown, Error, ProductRequest, unknown>;
}

export interface EditProductProps {
  mutation: UseMutationResult<unknown, Error, ProductRequest, unknown>;
  productDetail: ProductResponse;
}

export interface ProductImagesProps {
  productId?: string;
}

export interface ProductResponse {
  id: number;
  title: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName: string;
  quantity: number;
  createdAt: string;
  productImages: ProductImages[];
  productAttributes: ProductAttributes[];
}

export interface ProductUploadedImagesProps{
  productImages:ProductImages[]
}

export interface ProductImages {
  id: number;
  imagePath: string;
  isDefaultImage: boolean;
  createdAt: string;
}

export interface ProductAttributes {
  id: number;
  values: string;
  price: number;
  createdAt: string;
}

export interface AttributeResponse {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  createdAt: string;
  categoryName: string;
}

export interface AttributeRequest {
  title: string;
  description?: string;
  categoryId: string;
}

export interface ProductRequest {
  title: string;
  description?: string;
  price: number;
  category: number;
  quantity: number;
}

export interface ProductImageRequest {
  productId:string,
  file:File
}
