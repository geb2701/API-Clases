import { apiClient } from "@/lib/generic-ky-client";
import { fromObject } from "@/lib/utils";
import { Product } from "@/types/product";


export const getProducts = async() => {
  const response = await apiClient.get('products');
	const data = fromObject(Product, await response.json());
  return data;

};
