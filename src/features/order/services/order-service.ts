import { apiClient } from "@/lib/generic-ky-client";

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface AddressInfo {
  firstName: string;
  lastName: string;
  dni: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export interface CreateOrderRequest {
  billing: AddressInfo;
  shipping?: AddressInfo; // Opcional
  payment: PaymentInfo;
  items: OrderItemRequest[];
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
}

/**
 * Crear una nueva orden
 */
export const createOrder = async (orderData: CreateOrderRequest): Promise<OrderResponse> => {
  console.log("createOrder API call - Request:", orderData);
  try {
    const response = await apiClient.post('orders', {
      json: orderData
    });
    
    console.log("createOrder API call - Response status:", response.status);
    
    const data = await response.json<OrderResponse>();
    console.log("createOrder API call - Response data:", data);
    return data;
  } catch (error: any) {
    console.error("createOrder API call - Error:", error);
    
    // Si es un error de ky, intentar extraer el mensaje del body
    if (error.response) {
      try {
        const errorBody = await error.response.json<{ error?: string }>();
        if (errorBody.error) {
          throw new Error(errorBody.error);
        }
      } catch (parseError) {
        // Si no se puede parsear, crear un error basado en el status
        const status = error.response?.status;
        const statusText = error.response?.statusText;
        
        if (status === 401 || status === 403) {
          throw new Error("Usuario no autenticado. Por favor, inicia sesión.");
        } else if (status === 400) {
          throw new Error("Error en los datos enviados. Por favor, verifica la información.");
        } else {
          throw new Error(statusText || `Error al crear la orden (HTTP ${status || "desconocido"})`);
        }
      }
    }
    
    // Si el error ya es un Error, relanzarlo
    if (error instanceof Error) {
      throw error;
    }
    
    // Si no, crear un nuevo Error
    throw new Error(error?.message || "Error al crear la orden. Por favor, intenta nuevamente.");
  }
};

/**
 * Obtener órdenes por DNI
 */
export const getOrdersByDni = async (dni: string): Promise<OrderResponse[]> => {
  const response = await apiClient.get(`orders/by-dni/${dni}`);
  const data = await response.json<OrderResponse[]>();
  return data;
};

/**
 * Obtener orden por ID
 */
export const getOrderById = async (id: number): Promise<OrderResponse> => {
  const response = await apiClient.get(`orders/${id}`);
  const data = await response.json<OrderResponse>();
  return data;
};

