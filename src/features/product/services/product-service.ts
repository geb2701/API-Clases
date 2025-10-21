import { apiClient } from "@/lib/generic-ky-client";
import { fromObject } from "@/lib/utils";
import { Product } from "@/types/product";

/**
 * Obtener todos los productos activos
 * GET /api/productos
 */
export const getProducts = async(): Promise<Product[]> => {
  const response = await apiClient.get('productos');
  const responseData = await response.json<object[]>();
  
  if (!Array.isArray(responseData)) {
    throw new Error('Invalid response format: expected an array');
  }

  return responseData.map((item) => fromObject(Product, item));
};

/**
 * Obtener producto por ID
 * GET /api/productos/{id}
 */
export const getProductById = async(id: number): Promise<Product> => {
  const response = await apiClient.get(`productos/${id}`);
  const responseData = await response.json();
  
  return fromObject(Product, responseData);
};

/**
 * Buscar productos por categoría
 * GET /api/productos/categoria/{category}
 */
export const getProductsByCategory = async(category: string): Promise<Product[]> => {
  const response = await apiClient.get(`productos/categoria/${category}`);
  const responseData = await response.json<object[]>();
  
  if (!Array.isArray(responseData)) {
    throw new Error('Invalid response format: expected an array');
  }

  return responseData.map((item) => fromObject(Product, item));
};

/**
 * Buscar productos por texto
 * GET /api/productos/buscar?q={query}
 */
export const searchProducts = async(query: string): Promise<Product[]> => {
  const response = await apiClient.get('productos/buscar', {
    searchParams: { q: query }
  });
  const responseData = await response.json<object[]>();
  
  if (!Array.isArray(responseData)) {
    throw new Error('Invalid response format: expected an array');
  }

  return responseData.map((item) => fromObject(Product, item));
};

/**
 * Crear nuevo producto (Admin)
 * POST /api/productos
 */
export const createProduct = async(productData: {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  discount?: number;
}): Promise<Product> => {
  const response = await apiClient.post('productos', {
    json: productData
  });
  const responseData = await response.json();
  
  return fromObject(Product, responseData);
};

/**
 * Actualizar producto (Admin)
 * PUT /api/productos/{id}
 */
export const updateProduct = async(id: number, productData: {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  discount?: number;
}): Promise<Product> => {
  const response = await apiClient.put(`productos/${id}`, {
    json: productData
  });
  const responseData = await response.json();
  
  return fromObject(Product, responseData);
};

/**
 * Eliminar producto (Admin) - Soft delete
 * DELETE /api/productos/{id}
 */
export const deleteProduct = async(id: number): Promise<void> => {
  await apiClient.delete(`productos/${id}`);
};