import { createFileRoute } from "@tanstack/react-router";
import AddProduct from "@/features/product/pages/add-product";
import { getCategories } from "@/features/category/services/category-service";

export const Route = createFileRoute("/gestionar/agregar")({
  component: AddProduct,
  loader: async ({ context }) => {
    // Precargar categorías para el formulario
    await context.queryClient.ensureQueryData({
      queryKey: ["categories"],
      queryFn: getCategories,
    });
    return {
      crumb: {
        label: "Agregar",
      },
    };
  },
});
