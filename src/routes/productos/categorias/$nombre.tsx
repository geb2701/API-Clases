import { CategoryPage } from "@/features/product/pages/category";
import { createFileRoute } from "@tanstack/react-router";
import { getProducts } from "@/features/product/services/product-service";

const titleFromSlug = (s: string) =>
  decodeURIComponent(s)
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\p{L}/gu, (c) => c.toUpperCase());

export const Route = createFileRoute("/productos/categorias/$nombre")({
  component: CategoryPage,
  loader: async ({ context, params }) => {
    // Precargar productos para filtrar por categoría
    await context.queryClient.ensureQueryData({
      queryKey: ["productos-paginated"],
      queryFn: getProducts,
    });
    return {
      crumb: {
        label: titleFromSlug(params.nombre),
      },
    };
  },
});
