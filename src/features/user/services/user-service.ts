import { apiClient } from "@/lib/generic-ky-client";
import type { User } from "@/types/user";

/**
 * Obtener todos los usuarios (Admin)
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const users = await apiClient.get("users").json<User[]>();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("No se pudieron cargar los usuarios");
  }
};

/**
 * Obtener usuario por ID
 */
export const getUserById = async (id: number): Promise<User> => {
  try {
    const user = await apiClient.get(`users/${id}`).json<User>();
    return user;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw new Error("No se pudo cargar el usuario");
  }
};

/**
 * Obtener usuario por email
 */
export const getUserByEmail = async (email: string): Promise<User> => {
  try {
    const user = await apiClient.get(`users/email/${email}`).json<User>();
    return user;
  } catch (error) {
    console.error(`Error fetching user by email ${email}:`, error);
    throw new Error("No se pudo cargar el usuario");
  }
};

/**
 * Actualizar usuario
 */
export const updateUser = async (id: number, userData: Partial<User>): Promise<User> => {
  try {
    const updatedUser = await apiClient
      .put(`users/${id}`, {
        json: userData,
      })
      .json<User>();
    return updatedUser;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw new Error("No se pudo actualizar el usuario");
  }
};

/**
 * Eliminar usuario (Admin)
 */
export const deleteUser = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`users/${id}`);
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw new Error("No se pudo eliminar el usuario");
  }
};

/**
 * Verificar si un email existe
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const response = await apiClient
      .post("users/check-email", {
        json: { email },
      })
      .json<boolean>();
    return response;
  } catch (error) {
    console.error("Error checking email:", error);
    return false;
  }
};

/**
 * Obtener estadísticas de usuarios (Admin)
 */
export const getUserStats = async (): Promise<{
  total: number;
  active: number;
  inactive: number;
}> => {
  try {
    const users = await getAllUsers();
    const active = users.filter((u) => u.isActive).length;
    return {
      total: users.length,
      active,
      inactive: users.length - active,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw new Error("No se pudieron cargar las estadísticas");
  }
};



