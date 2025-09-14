import { CategoryPage } from "@/features/product/pages/category";
import { createFileRoute } from "@tanstack/react-router";

const titleFromSlug = (s: string) =>
  decodeURIComponent(s)
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\p{L}/gu, (c) => c.toUpperCase());

export const Route = createFileRoute("/productos/categorias/$nombre")({
  component: CategoryPage,
  loader: ({ params }) => ({
    crumb: {
      label: titleFromSlug(params.nombre),
    },
  }),
});
