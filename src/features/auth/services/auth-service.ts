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
  try {
    const response = await apiClient.post('auth/register', {
      json: data
    });

    return await response.json<AuthResponse>();
  } catch (error: any) {
    // Si el error tiene respuesta, intentar extraer el mensaje
    if (error.response) {
      try {
        const errorBody = await error.response.json<AuthResponse>();
        return errorBody;
      } catch {
        // Si no se puede parsear, devolver error genérico
        return {
          success: false,
          message: error.response?.status === 400
            ? "Error al registrar. El email puede ya estar en uso."
            : "Error al registrar el usuario"
        };
      }
    }
    // Si no hay respuesta, devolver error genérico
    return {
      success: false,
      message: "Error de conexión. Por favor, verifica tu conexión a internet."
    };
  }
};

/**
 * Iniciar sesión
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  console.log("🔐 Iniciando login con:", { email: data.email, password: "***" });

  try {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/";
    console.log("📡 URL de API:", `${API_URL}auth/login`);

    const response = await apiClient.post('auth/login', {
      json: data
    });

    console.log("✅ Respuesta recibida, status:", response.status);
    const result = await response.json<AuthResponse>();
    console.log("📦 Datos de respuesta:", result);

    return result;
  } catch (error: any) {
    console.error("❌ Error en login:", error);
    console.error("❌ Detalles del error:", {
      message: error.message,
      response: error.response,
      status: error.response?.status,
    });

    // Si el error tiene respuesta, intentar extraer el mensaje
    if (error.response) {
      try {
        const errorBody = await error.response.json<AuthResponse>();
        console.log("📦 Error del servidor:", errorBody);
        return errorBody;
      } catch (parseError) {
        console.error("❌ Error al parsear respuesta:", parseError);
        // Si no se puede parsear, devolver error genérico
        return {
          success: false,
          message: error.response?.status === 401 || error.response?.status === 400
            ? "Credenciales inválidas"
            : `Error al iniciar sesión (${error.response?.status || "desconocido"})`
        };
      }
    }

    // Si no hay respuesta, devolver error genérico
    const errorMessage = error.message || "Error de conexión. Por favor, verifica tu conexión a internet.";
    console.error("❌ Error de conexión:", errorMessage);

    return {
      success: false,
      message: errorMessage
    };
  }
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

