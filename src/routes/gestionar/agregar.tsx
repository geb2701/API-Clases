import { createFileRoute } from "@tanstack/react-router";
import AddProduct from "@/features/product/pages/add-product";

export const Route = createFileRoute("/gestionar/agregar")({
  component: AddProduct,
  loader: () => ({
    crumb: {
      label: "Agregar",
    },
  }),
});
