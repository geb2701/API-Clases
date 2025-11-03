import { apiClient } from "@/lib/generic-ky-client";
import { fromObject } from "@/lib/utils";
import { Product } from "@/types/product";


export const getProducts = async () => {
  // Obtener todos los productos haciendo múltiples peticiones si es necesario
  let allProducts: object[] = [];
  let page = 0;
  const size = 100; // Obtener muchos productos por página
  let totalPages = 1;

  do {
    const response = await apiClient.get(`products?page=${page}&size=${size}`);

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

    allProducts = allProducts.concat(responseData.content);
    totalPages = responseData.totalPages;
    page++;
  } while (page < totalPages);

  return allProducts.map((item) => fromObject(Product, item));
};

export const getMyProducts = async () => {
  // Obtener solo los productos del usuario autenticado
  let allProducts: object[] = [];
  let page = 0;
  const size = 100; // Obtener muchos productos por página
  let totalPages = 1;

  do {
    const response = await apiClient.get(`products/my-products?page=${page}&size=${size}`);

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

    allProducts = allProducts.concat(responseData.content);
    totalPages = responseData.totalPages;
    page++;
  } while (page < totalPages);

  console.log('getMyProducts: Total products from backend:', allProducts.length);
  console.log('getMyProducts: First product raw data:', allProducts[0]);
  
  const products = allProducts.map((item) => {
    console.log('getMyProducts: Raw item from backend:', item);
    const product = fromObject(Product, item);
    console.log('getMyProducts: Product after fromObject:', {
      id: product.id,
      name: product.name,
      image: product.image,
      imageType: typeof product.image,
      hasImage: !!product.image
    });
    return product;
  });
  
  return products;
};

export const getProductById = async (id: number): Promise<Product> => {
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

export const createProduct = async (productData: CreateProductRequest): Promise<Product> => {
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

export const updateProduct = async (id: number, productData: UpdateProductRequest): Promise<Product> => {
  const response = await apiClient.put(`products/${id}`, {
    json: productData
  });

  const responseData = await response.json<object>();
  return fromObject(Product, responseData);
};

export const deleteProduct = async (id: number): Promise<void> => {
  await apiClient.delete(`products/${id}`);
};