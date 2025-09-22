import React, { useEffect } from "react";
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

type SortKey = "name" | "price";
type SortDir = "asc" | "desc";

const pageSize = 12;

const ProductosPage = () => {
  const api = useProducts();

  const { data: products } = useSuspenseQuery(api.queryOptions.all());

  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<string | null>(null);
  const [sortKey, setSortKey] = React.useState<SortKey>("name");
  const [sortDir, setSortDir] = React.useState<SortDir>("asc");
  const [page, setPage] = React.useState(1);

  const setSort = (k: SortKey, d: SortDir) => {
    setSortKey(k);
    setSortDir(d);
  };

  const categories = React.useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );

  const q = query.trim().toLowerCase();

  const filtered = React.useMemo(() => {
    return products.filter((p) => {
      const matchCat = category ? p.category === category : true;
      const matchText =
        q.length === 0 ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchCat && matchText;
    });
  }, [products, category, q]);

  const sorted = React.useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let comp = 0;
      if (sortKey === "name") {
        comp = a.name.localeCompare(b.name);
      } else {
        comp = a.price - b.price;
      }
      return sortDir === "asc" ? comp : -comp;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const items = sorted.slice(start, start + pageSize);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setPage(1);
  }, [q, category, sortKey, sortDir]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Productos</h1>
          <p className="text-sm text-muted-foreground">{total} resultados</p>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o descripción…"
            className="md:w-64"
          />

          <Select
            value={category ?? "all"}
            onValueChange={(v) => setCategory(v === "all" ? null : v)}
          >
            <SelectTrigger className="md:w-52">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={`${sortKey}:${sortDir}`}
            onValueChange={(v) => {
              const [k, d] = v.split(":") as [SortKey, SortDir];
              setSort(k, d);
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

      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {/* Paginación */}
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
    </div>
  );
};

export default ProductosPage;
