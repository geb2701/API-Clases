// src/routes/__root.tsx  (o donde tengas la ruta "/")
import { createFileRoute } from '@tanstack/react-router'
import { useProducts } from '@/features/Productos/hooks/useProducts'

// shadcn/ui
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="container mx-auto px-4 py-6">
      <HomeProducts />
    </div>
  )
}

function HomeProducts() {
  const {
    loading,
    error,
    items,
    total,
    page,
    setPage,
    pageSize,
    categories,
    category,
    setCategory,
    query,
    setQuery,
    sortKey,
    sortDir,
    setSort,
  } = useProducts({ pageSize: 12 });

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Productos</h1>
          <p className="text-sm text-muted-foreground">{total} resultados</p>
        </div>

        {/* Filtros / Controles */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o descripción…"
            className="md:w-64"
          />

          <Select
            value={category ?? 'all'}
            onValueChange={(v) => setCategory(v === 'all' ? null : v)}
          >
            <SelectTrigger className="md:w-52">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={`${sortKey}:${sortDir}`}
            onValueChange={(v) => {
              const [k, d] = v.split(':') as ['name' | 'price', 'asc' | 'desc']
              setSort(k, d)
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

      {/* Grid de productos */}
      {loading ? (
        <ProductsSkeleton />
      ) : error ? (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{error}</p>
            <p className="text-sm text-muted-foreground">Reintenta más tarde.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
            {items.map((p) => (
              <Card key={p.id} className="overflow-hidden group">
                <div className="aspect-square w-full overflow-hidden bg-muted/30">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-tight">{p.name}</CardTitle>
                    <Badge variant="secondary" className="shrink-0">{p.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                  <p className="mt-2 text-lg font-semibold">${p.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => navigateToDetail(p.id)}>
                    Ver detalle
                  </Button>
                  <Button size="sm" onClick={() => addToCart(p.id)}>Agregar</Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Paginación simple */}
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setPage(page - 1)}>
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {page} / {Math.max(1, Math.ceil(total / pageSize))}
            </span>
            <Button variant="outline" size="sm" onClick={() => setPage(page + 1)}>
              Siguiente
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

/* Helpers (podés reemplazar por tu lógica real) */
function navigateToDetail(id: number) {
  // Ej: router.navigate({ to: `/producto/${id}` })
  console.log('ver detalle', id)
}

function addToCart(id: number) {
  // Ej: cartStore.add(id)
  console.log('agregar al carrito', id)
}

/* Skeleton de carga */
function ProductsSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-square w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-6 w-24" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
