import { createFileRoute } from "@tanstack/react-router";
import { ManageProductsPage } from "@/features/product/pages/manage-products";

export const Route = createFileRoute("/gestionar/")({
  component: ManageProductsPage,
});
