import { apiClient } from "@/lib/generic-ky-client";
import { fromObject } from "@/lib/utils";
import { Product } from "@/types/product";


export const getProducts = async() => {
  const response = await apiClient.get('products');

  const responseData = await response.json<{
    content: object[],
    totalElements: number,
    totalPages: number,
    size: number,
    number: number
  }>();
  
  if (!responseData.content || !Array.isArray(responseData.content)) {
    throw new Error('Invalid response format: expected an array in content field');
  }

  return responseData.content.map((item) => fromObject(Product, item));
};

export const getProductById = async(id: number): Promise<Product> => {
  const response = await apiClient.get(`products/${id}`);
  
  const responseData = await response.json<object>();
  if (!responseData) {
    throw new Error(`Product with id ${id} not found`);
  }

  return fromObject(Product, responseData);
};

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  discount?: number;
}

export const createProduct = async(productData: CreateProductRequest): Promise<Product> => {
  const response = await apiClient.post('products', {
    json: productData
  });
  
  const responseData = await response.json<object>();
  return fromObject(Product, responseData);
};

export interface UpdateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  discount?: number;
}

export const updateProduct = async(id: number, productData: UpdateProductRequest): Promise<Product> => {
  const response = await apiClient.put(`products/${id}`, {
    json: productData
  });
  
  const responseData = await response.json<object>();
  return fromObject(Product, responseData);
};

export const deleteProduct = async(id: number): Promise<void> => {
  await apiClient.delete(`products/${id}`);
};