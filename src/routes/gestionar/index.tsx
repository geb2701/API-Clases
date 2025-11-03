import { createFileRoute } from "@tanstack/react-router";
import { ManageProductsPage } from "@/features/product/pages/manage-products";
import { getMyProducts } from "@/features/product/services/product-service";

export const Route = createFileRoute("/gestionar/")({
  component: ManageProductsPage,
  loader: async ({ context }) => {
    // Precargar productos del usuario para la gestión
    await context.queryClient.ensureQueryData({
      queryKey: ["productos-mios"],
      queryFn: getMyProducts,
    });
  },
});
