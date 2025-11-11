import { queryOptions } from "@tanstack/react-query";
import { getCategories } from "../services/category-service";

const queryKey = ["categories"];

export const useCategories = () => {
  const all = () => {
    return queryOptions({
      queryKey: queryKey,
      queryFn: async () => getCategories(),
      staleTime: 1000 * 60 * 10, // 10 minutos (las categorías cambian poco)
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });
  };

  return {
    queryOptions: {
      all,
      queryKey,
    },
    // Helper para invalidar la caché
    invalidateKeys: {
      all: queryKey,
    },
  };
};





