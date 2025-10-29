import { apiClient } from "@/lib/generic-ky-client";
import type { Category } from "@/types/product";

/**
 * Obtener todas las categorías activas
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const categories = await apiClient.get("categories").json<Category[]>();
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("No se pudieron cargar las categorías");
  }
};

/**
 * Obtener categoría por ID
 */
export const getCategoryById = async (id: number): Promise<Category> => {
  try {
    const category = await apiClient.get(`categories/${id}`).json<Category>();
    return category;
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    throw new Error("No se pudo cargar la categoría");
  }
};

/**
 * Obtener categoría por nombre
 */
export const getCategoryByName = async (name: string): Promise<Category> => {
  try {
    const category = await apiClient.get(`categories/name/${name}`).json<Category>();
    return category;
  } catch (error) {
    console.error(`Error fetching category ${name}:`, error);
    throw new Error("No se pudo cargar la categoría");
  }
};

/**
 * Buscar categorías por nombre
 */
export const searchCategories = async (query: string): Promise<Category[]> => {
  try {
    const categories = await apiClient
      .get("categories/search", {
        searchParams: { q: query },
      })
      .json<Category[]>();
    return categories;
  } catch (error) {
    console.error("Error searching categories:", error);
    throw new Error("Error al buscar categorías");
  }
};


