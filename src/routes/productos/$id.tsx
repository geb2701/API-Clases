import ProductDetailPage from "@/features/product/pages/product-detail";
import { createFileRoute } from "@tanstack/react-router";
import { getProductById } from "@/features/product/services/product-service";

export const Route = createFileRoute("/productos/$id")({
  component: ProductDetailPage,
  loader: async ({ context, params }) => {
    const productId = Number(params.id);
    // Precargar el producto específico
    await context.queryClient.ensureQueryData({
      queryKey: ["productos", "byId", productId],
      queryFn: () => getProductById(productId),
    });
    return {
      crumb: {
        label: "Detalle Producto",
      },
    };
  },
});