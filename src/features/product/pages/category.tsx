/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useProducts } from "../hooks/use-products";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Route } from "@/routes/productos/categorias/$nombre";

type SortKey = "name" | "price";
type SortDir = "asc" | "desc";

export const CategoryPage = () => {
  const { nombre } = Route.useParams();

  // normalizamos el parámetro para matchear categorías “hogar”, “Hogar”, “hogar-…” etc.
  const slug = decodeURIComponent(nombre);
  const norm = (s: string) =>
    s
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .replace(/-/g, " ")
      .trim();

  // datos
  const api = useProducts();
  const { data: products } = useSuspenseQuery(api.queryOptions.all());

  // estado UI
  const [query, setQuery] = React.useState("");
  const [sortKey, setSortKey] = React.useState<SortKey>("name");
  const [sortDir, setSortDir] = React.useState<SortDir>("asc");
  const [page, setPage] = React.useState(1);
  const pageSize = 12;

  // filtrar por categoría fija de la URL
  const inCategory = React.useMemo(
    () => products.filter((p) => norm(p.category) === norm(slug)),
    [products, slug]
  );

  // título bonito: usamos la categoría real si existe, si no el slug
  const displayTitle = inCategory[0]?.category ?? slug;

  // búsqueda
  const q = query.trim().toLowerCase();
  const filtered = React.useMemo(() => {
    if (!q) return inCategory;
    return inCategory.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [inCategory, q]);

  // orden
  const sorted = React.useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const comp =
        sortKey === "name" ? a.name.localeCompare(b.name) : a.price - b.price;
      return sortDir === "asc" ? comp : -comp;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  // paginación
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const items = sorted.slice(start, start + pageSize);

  React.useEffect(() => {
    setPage(1);
  }, [q, sortKey, sortDir, slug]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {displayTitle}
          </h1>
          <p className="text-sm text-muted-foreground">{total} resultados</p>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Buscar en ${displayTitle}…`}
            className="md:w-64"
          />

          <Select
            value={`${sortKey}:${sortDir}`}
            onValueChange={(v) => {
              const [k, d] = v.split(":") as [SortKey, SortDir];
              setSortKey(k);
              setSortDir(d);
            }}
          >
            <SelectTrigger className="md:w-48">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name:asc">Nombre ↑</SelectItem>
              <SelectItem value="name:desc">Nombre ↓</SelectItem>
              <SelectItem value="price:asc">Precio ↑</SelectItem>
              <SelectItem value="price:desc">Precio ↓</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Grid */}
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
        {items.length === 0 && (
          <div className="col-span-full py-10 text-center text-sm text-muted-foreground">
            No hay productos que coincidan con tu búsqueda.
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
};
