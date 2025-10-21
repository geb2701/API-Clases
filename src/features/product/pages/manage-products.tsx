import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ImageLazy from "@/components/image-lazy";
import type { Product } from "@/types/product";
import { Edit, Trash2, Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useProducts } from "../hooks/use-products";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { getImageUrl } from "../services/upload-service";
import { deleteProduct } from "../services/product-service";

export const ManageProductsPage = () => {
  const queryClient = useQueryClient();
  const api = useProducts();
  const { invalidateKeys } = api;
  const mockProducts = useSuspenseQuery(api.queryOptions.all()).data;

  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  // Filtrar productos por término de búsqueda
  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset a la primera página cuando se filtra
  }, [searchTerm, products]);

  // Calcular productos para la página actual
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleDeleteProduct = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;

    try {
      // Eliminar producto usando la API
      await deleteProduct(selectedProduct.id);

      // Invalidar caché para refrescar la lista
      await queryClient.invalidateQueries({ queryKey: invalidateKeys.paginated });

      // Actualizar lista local
      setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));

      toast.success("Producto eliminado", {
        description: `"${selectedProduct.name}" ha sido eliminado correctamente.`,
      });

      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      toast.error("Error al eliminar producto", {
        description: error instanceof Error ? error.message : "No se pudo eliminar el producto. Inténtalo de nuevo.",
      });
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {currentProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <div className="aspect-square w-full overflow-hidden bg-muted/30 flex items-center justify-center">
                    <ImageLazy
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="block max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute top-1 right-1">
                    <Badge variant={getStockBadgeVariant(product.stock)} className="text-xs px-1 py-0">
                      {getStockText(product.stock)}
                    </Badge>
                  </div>
                  {product.hasDiscount() && (
                    <div className="absolute top-1 left-1">
                      <Badge variant="destructive" className="text-xs px-1 py-0">
                        -{product.getDiscountPercentage()}%
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-1 px-3 pt-3">
                  <CardTitle className="text-sm line-clamp-2 leading-tight">{product.name}</CardTitle>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {product.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0 px-3 pb-3">
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-sm font-bold">
                      {product.getFormattedDiscountPrice()}
                    </span>
                    {product.hasDiscount() && (
                      <span className="text-xs text-muted-foreground line-through">
                        {product.getFormattedPrice()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span className="truncate">{product.category}</span>
                    <span>{product.stock}u</span>
                  </div>

                  <div className="flex gap-1">
                    <Link to={`/gestionar/editar/${product.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full h-7 text-xs px-2">
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="h-7 px-2"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Controles de paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Información de paginación */}
          <div className="text-center text-sm text-muted-foreground mt-4">
            Mostrando {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} de {filteredProducts.length} productos
          </div>
        </>
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
