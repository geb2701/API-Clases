// src/pages/HomePage.tsx
import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useProducts } from "../product/hooks/useProducts";
import { useCartContext } from "@/context/cart-context";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

type SortKey = "name" | "price";
type SortDir = "asc" | "desc";

const pageSize = 12;

const HomePage = () => {
  const api = useProducts();
  const { addItem, getItemQuantity } = useCartContext();

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
  React.useEffect(() => {
    setPage(1);
  }, [q, category, sortKey, sortDir]);

  const navigateToDetail = (id: number) => {
    // TODO: integrar con tu router: navigate(`/products/${id}`)
    console.log("go detail", id);
  };
  const addToCart = (product: any) => {
    addItem(product);
  };

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
          <Card key={p.id} className="overflow-hidden group">
            <div className="aspect-square w-full overflow-hidden bg-muted/30">
              <img
                src={`http://localhost:3000/${p.image}`}
                alt={p.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base leading-tight">
                  {p.name}
                </CardTitle>
                <Badge variant="secondary" className="shrink-0">
                  {p.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {p.description}
              </p>
              <p className="mt-2 text-lg font-semibold">
                {/* si tenés getFormattedPrice en la clase */}
                {/* {p.getFormattedPrice()} */}
                ${p.price.toFixed(2)}
              </p>
            </CardContent>

            <CardFooter className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => navigateToDetail(p.id)}
              >
                Ver detalle
              </Button>
              <Button 
                size="sm" 
                onClick={() => addToCart(p)}
                className="flex items-center gap-1"
              >
                <ShoppingCart className="w-4 h-4" />
                {getItemQuantity(p.id) > 0 && `(${getItemQuantity(p.id)})`}
              </Button>
            </CardFooter>
          </Card>
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

export default HomePage;
