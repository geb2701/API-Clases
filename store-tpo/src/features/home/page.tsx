import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
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
import { ShoppingCart, Star, Clock, Zap } from "lucide-react";
import { useProducts } from "../product/hooks/use-products";

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

  // Productos destacados (más vendidos o populares)
  const featuredProducts = React.useMemo(() => {
    return products.slice(0, 4); // Primeros 4 productos como destacados
  }, [products]);

  // Productos por categoría para ofertas
  const productsByCategory = React.useMemo(() => {
    const grouped = products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {} as Record<string, typeof products>);

    return Object.entries(grouped).map(([category, categoryProducts]) => ({
      category,
      products: categoryProducts.slice(0, 3), // Top 3 por categoría
      discount: Math.floor(Math.random() * 30) + 10, // Descuento aleatorio 10-40%
    }));
  }, [products]);

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
    <div className="space-y-8">
      {/* Banner Principal */}
      <section className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-8 py-16 md:px-12 md:py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Bienvenido a nuestra tienda
            </h1>
            <p className="mt-4 text-lg text-blue-100 md:text-xl">
              Descubre productos increíbles con las mejores ofertas del mercado.
              Envío gratis en compras superiores a $100.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" className="w-fit">
                Ver Productos
              </Button>
              <Button size="lg" variant="outline" className="w-fit border-white text-white hover:bg-white hover:text-gray-900">
                Ofertas Especiales
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 transform">
          <div className="h-32 w-32 rounded-full bg-white/10"></div>
        </div>
        <div className="absolute -bottom-4 -left-4 transform">
          <div className="h-24 w-24 rounded-full bg-white/10"></div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Star className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">Productos Destacados</h2>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="aspect-square w-full overflow-hidden bg-muted/30 relative">
                <img
                  src={`http://localhost:3000/${product.image}`}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <Badge className="absolute top-2 left-2 bg-red-500">
                  Destacado
                </Badge>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-base leading-tight">
                  {product.name}
                </CardTitle>
                <Badge variant="secondary" className="w-fit">
                  {product.category}
                </Badge>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-lg font-semibold text-green-600">
                  ${product.price.toFixed(2)}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full flex items-center gap-1"
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Agregar al carrito
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Ofertas por Categoría */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Zap className="h-6 w-6 text-orange-500" />
          <h2 className="text-2xl font-bold">Ofertas por Categoría</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {productsByCategory.map(({ category, products: categoryProducts, discount }) => (
            <Card key={category} className="overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{category}</h3>
                  <Badge variant="secondary" className="bg-white text-orange-600">
                    -{discount}%
                  </Badge>
                </div>
                <p className="text-sm opacity-90 mt-1">Oferta limitada</p>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {categoryProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                        <img
                          src={`http://localhost:3000/${product.image}`}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground line-through">
                            ${(product.price * 1.2).toFixed(2)}
                          </span>
                          <span className="text-sm font-semibold text-green-600">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addToCart(product)}
                        className="shrink-0"
                      >
                        <ShoppingCart className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Anuncio de Oferta del Día */}
      <section>
        <Card className="overflow-hidden bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm font-medium">OFERTA DEL DÍA</span>
                </div>
                <h3 className="text-xl font-bold mb-1">Descuento Especial</h3>
                <p className="text-sm opacity-90">
                  Aprovecha nuestra oferta especial con hasta 50% de descuento en productos seleccionados
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">50%</div>
                <div className="text-sm opacity-90">OFF</div>
              </div>
            </div>
            <Button
              variant="secondary"
              className="mt-4 w-fit"
              onClick={() => setCategory("Tecnología")}
            >
              Ver Ofertas
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Sección de Búsqueda y Filtros */}
      <section>
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Todos los Productos</h2>
            <p className="text-sm text-muted-foreground">{total} productos disponibles</p>
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

        {/* Grid de Productos */}
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
          {items.map((p) => (
            <Card key={p.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
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
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
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
      </section>
    </div>
  );
};

export default HomePage;
