import { apiClient } from "@/lib/generic-ky-client";

export interface RegisterRequest {
  name: string;
  surname?: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  surname?: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  user?: UserResponse;
  token?: string;
  message?: string;
}

/**
 * Registrar nuevo usuario
 */
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await apiClient.post('auth/register', {
    json: data
  });
  
  return await response.json<AuthResponse>();
};

/**
 * Iniciar sesión
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post('auth/login', {
    json: data
  });
  
  return await response.json<AuthResponse>();
};

/**
 * Cerrar sesión
 */
export const logout = async (): Promise<void> => {
  await apiClient.post('auth/logout');
};

/**
 * Verificar si un email existe
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
  const response = await apiClient.get(`auth/check-email/${email}`);
  const data = await response.json<{ exists: boolean }>();
  return data.exists;
};

