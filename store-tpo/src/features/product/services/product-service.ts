import { apiClient } from "@/lib/generic-ky-client";
import { fromObject } from "@/lib/utils";
import { Product } from "@/types/product";


export const getProducts = async() => {
  const response = await apiClient.get('productos.json');

  const responseData = await response.json<object[]>();
  if (!Array.isArray(responseData)) {
    throw new Error('Invalid response format: expected an array');
  }

  return responseData.map((item) => fromObject(Product, item));
};

export const getProductById = async(id: number): Promise<Product> => {
  const response = await apiClient.get('productos.json');
  
  const responseData = await response.json<object[]>();
  if (!Array.isArray(responseData)) {
    throw new Error('Invalid response format: expected an array');
  }

  const productData = responseData.find((item: any) => item.id === id);
  if (!productData) {
    throw new Error(`Product with id ${id} not found`);
  }

  return fromObject(Product, productData);
};