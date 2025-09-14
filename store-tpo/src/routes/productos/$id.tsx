import ProductDetailPage from "@/features/product/pages/product-detail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/productos/$id")({
  component: ProductDetailPage,
  loader: () => ({
    crumb: {
      label: ` Detalle Producto`,
    },
  }),
});