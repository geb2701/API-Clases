import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ImageLazy from "@/components/image-lazy";
import { Product } from "@/types/product";
import { Edit, Trash2, Search, Plus } from "lucide-react";
import { useProducts } from "../hooks/use-products";
import { useSuspenseQuery } from "@tanstack/react-query";

export const ManageProductsPage = () => {
  const api = useProducts();
  const mockProducts = useSuspenseQuery(api.queryOptions.all()).data;

  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Filtrar productos por término de búsqueda
  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleDeleteProduct = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      // Simular delay de API
      setTimeout(() => {
        setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
        toast.success("Producto eliminado", {
          description: `"${selectedProduct.name}" ha sido eliminado correctamente.`,
        });
        setIsDeleteDialogOpen(false);
        setSelectedProduct(null);
      }, 500);
    }
  };

  const getStockBadgeVariant = (stock: number) => {
    if (stock === 0) return "destructive";
    if (stock < 10) return "secondary";
    return "default";
  };

  const getStockText = (stock: number) => {
    if (stock === 0) return "Sin stock";
    if (stock < 10) return "Poco stock";
    return "En stock";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestionar Productos</h1>
            <p className="text-muted-foreground mt-2">
              Administra tu catálogo de productos
            </p>
          </div>
          <Link to="/gestionar/agregar">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Agregar Producto
            </Button>
          </Link>
        </div>

        {/* Barra de búsqueda */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter(p => p.stock > 0).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sin Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter(p => p.stock === 0).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de productos */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-muted-foreground text-center">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron productos</h3>
              <p>Intenta con otros términos de búsqueda o agrega un nuevo producto.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-square relative">
                <ImageLazy
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={getStockBadgeVariant(product.stock)}>
                    {getStockText(product.stock)}
                  </Badge>
                </div>
                {product.hasDiscount() && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="destructive">
                      -{product.getDiscountPercentage()}%
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold">
                    {product.getFormattedDiscountPrice()}
                  </span>
                  {product.hasDiscount() && (
                    <span className="text-sm text-muted-foreground line-through">
                      {product.getFormattedPrice()}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>{product.category}</span>
                  <span>{product.stock} unidades</span>
                </div>

                <div className="flex gap-2">
                  <Link to={`/gestionar/editar/${product.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar producto?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el producto{" "}
              <strong>"{selectedProduct?.name}"</strong> de tu catálogo.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
