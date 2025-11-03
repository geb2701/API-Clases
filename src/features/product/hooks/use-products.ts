import { queryOptions } from "@tanstack/react-query";
import { getProducts, getProductById, getMyProducts } from "../services/product-service";

const queryKey = ["productos"];
const queryKeyPaginated = ["productos-paginated"];
const queryKeyMyProducts = ["productos-mios"];

export const useProducts = () => 
{
	const all = () => {
		return queryOptions({
			queryKey: queryKeyPaginated,
			queryFn: async () => getProducts(),
			// Reducir staleTime para que se actualice con cambios del servidor
			staleTime: 1000 * 30, // 30 segundos
			refetchOnWindowFocus: true,
			refetchOnReconnect: true,
		});
	};

	const myProducts = () => {
		return queryOptions({
			queryKey: queryKeyMyProducts,
			queryFn: async () => getMyProducts(),
			staleTime: 1000 * 30, // 30 segundos
			refetchOnWindowFocus: true,
			refetchOnReconnect: true,
		});
	};

	const byId = (productId: number) => {
		return queryOptions({
			queryKey: [...queryKey, "byId", productId],
			queryFn: async () => getProductById(productId),
			staleTime: 1000 * 30, // 30 segundos
			refetchOnWindowFocus: true,
			refetchOnReconnect: true,
		});
	};

	return {
		queryOptions: {
			all,
			myProducts,
			byId,
			queryKey,
			queryKeyPaginated,
			queryKeyMyProducts,
		},
		// Helper para invalidar la caché
		invalidateKeys: {
			all: queryKey,
			paginated: queryKeyPaginated,
			myProducts: queryKeyMyProducts,
		},
	};
};
