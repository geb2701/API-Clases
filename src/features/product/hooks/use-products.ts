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
			staleTime: Number.POSITIVE_INFINITY,
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
		});
	};

	return {
		queryOptions: {
			all,
			queryKey,
			queryKeyPaginated,
		},
	};
};
