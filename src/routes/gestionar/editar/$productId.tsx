import { createFileRoute } from "@tanstack/react-router";
import EditProduct from "@/features/product/pages/edit-product";

export const Route = createFileRoute("/gestionar/editar/$productId")({
  component: EditProduct,
  loader: () => ({
    crumb: {
      label: "Editar",
    },
  }),
});
