import { queryOptions } from "@tanstack/react-query";
import { getProducts } from "../services/product-service";

const queryKey = ["productos"];
const queryKeyPaginated = ["productos-paginated"];

export const useProducts = () => 
{
	const all = () => {
		return queryOptions({
			queryKey: queryKeyPaginated,
			queryFn: async () => getProducts(),
			// Reducir staleTime para que se actualice con cambios del servidor
			staleTime: 1000 * 60 * 5, // 5 minutos
			refetchOnWindowFocus: true,
			refetchOnReconnect: true,
		});
	};

	return {
		queryOptions: {
			all,
			queryKey,
			queryKeyPaginated,
		},
		// Helper para invalidar la caché
		invalidateKeys: {
			all: queryKey,
			paginated: queryKeyPaginated,
		},
	};
};
