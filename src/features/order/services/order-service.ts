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
  billingFirstName: string;
  billingLastName: string;
  billingDni: string;
  total: number;
  status: string;
  createdAt: string;
}

/**
 * Crear una nueva orden
 */
export const createOrder = async (orderData: CreateOrderRequest): Promise<OrderResponse> => {
  const response = await apiClient.post('orders', {
    json: orderData
  });
  
  const data = await response.json<OrderResponse>();
  return data;
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

