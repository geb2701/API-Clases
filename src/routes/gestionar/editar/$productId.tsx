import { createFileRoute } from "@tanstack/react-router";
import EditProduct from "@/features/product/pages/edit-product";
import { getProductById } from "@/features/product/services/product-service";
import { getCategories } from "@/features/category/services/category-service";

export const Route = createFileRoute("/gestionar/editar/$productId")({
  component: EditProduct,
  loader: async ({ context, params }) => {
    const productId = Number(params.productId);
    // Precargar producto y categorías para el formulario
    await Promise.all([
      context.queryClient.ensureQueryData({
        queryKey: ["productos", "byId", productId],
        queryFn: () => getProductById(productId),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["categories"],
        queryFn: getCategories,
      }),
    ]);
    return {
      crumb: {
        label: "Editar",
      },
    };
  },
});
