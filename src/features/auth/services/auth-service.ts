import { apiClient } from "@/lib/generic-ky-client";
import { User } from "@/types/user";

export interface RegisterData {
  name: string;
  surname?: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  surname: string;
  email: string;
}

/**
 * Registrar nuevo usuario
 * POST /api/auth/register
 */
export const register = async (data: RegisterData): Promise<User> => {
  const response = await apiClient.post('auth/register', {
    json: data
  });
  
  const userData = await response.json<UserResponse>();
  return new User(userData.id, userData.name, userData.surname, userData.email);
};

/**
 * Login de usuario
 * POST /api/auth/login
 */
export const login = async (data: LoginData): Promise<User> => {
  const response = await apiClient.post('auth/login', {
    json: data
  });
  
  const userData = await response.json<UserResponse>();
  return new User(userData.id, userData.name, userData.surname, userData.email);
};

/**
 * Logout de usuario
 * POST /api/auth/logout
 */
export const logout = async (): Promise<void> => {
  await apiClient.post('auth/logout');
};

