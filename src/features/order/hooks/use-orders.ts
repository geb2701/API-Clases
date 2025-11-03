import { queryOptions } from "@tanstack/react-query";
import { getMyOrders, getOrdersByUserId, getOrderById, type OrderResponse } from "../services/order-service";

const queryKey = ["orders"];

export const useOrders = () => {
	const myOrders = () => {
		return queryOptions({
			queryKey: [...queryKey, "my-orders"],
			queryFn: async () => getMyOrders(),
			staleTime: 1000 * 30, // 30 segundos (reducido para refrescar más rápido)
			refetchOnWindowFocus: true,
			refetchOnReconnect: true,
		});
	};

	const byUserId = (userId: number) => {
		return queryOptions({
			queryKey: [...queryKey, "user", userId],
			queryFn: async () => getOrdersByUserId(userId),
			staleTime: 1000 * 60 * 2, // 2 minutos
			refetchOnWindowFocus: true,
			refetchOnReconnect: true,
		});
	};

	const byId = (orderId: number) => {
		return queryOptions({
			queryKey: [...queryKey, "byId", orderId],
			queryFn: async () => getOrderById(orderId),
			staleTime: 1000 * 60 * 5, // 5 minutos
			refetchOnWindowFocus: true,
			refetchOnReconnect: true,
		});
	};

	return {
		queryOptions: {
			myOrders,
			byUserId,
			byId,
			queryKey,
		},
		invalidateKeys: {
			all: queryKey,
			myOrders: [...queryKey, "my-orders"],
		},
	};
};

