import { useSuspenseQuery } from "@tanstack/react-query";
import { getProductById } from "../services/product-service";

export const useProduct = (id: number) => {
  return useSuspenseQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
  });
};