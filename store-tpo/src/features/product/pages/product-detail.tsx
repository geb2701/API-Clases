import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, ArrowLeft, ShoppingCart } from "lucide-react";
import ImageLazy from "@/components/image-lazy";
import { useCartContext } from "@/context/cart-context";
import { Route } from "@/routes/productos/$id";
import { useProducts } from "../hooks/use-products";
import { useSuspenseQuery } from "@tanstack/react-query";

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

export const ProductDetailPage = () => {
  const { id } = Route.useParams();
  const productId = parseInt(id);
  const product = useSuspenseQuery(useProducts().queryOptions.all()).data.find(p => p.id === productId);

  const { addItem } = useCartContext();

  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (newQuantity: number) => {
    if (!product) return;
    const clamped = clamp(newQuantity, 1, product.stock);
    setQuantity(clamped);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Imagen del producto */}
        <div className="aspect-square w-full overflow-hidden bg-muted/30 rounded-lg flex items-center justify-center">
          <ImageLazy
            src={`http://localhost:3000${product.image}`}
            alt={product.name}
            className="block max-h-full max-w-full object-contain"
          />
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <Badge variant="secondary" className="text-sm">
                {product.category}
              </Badge>
            </div>

            <p className="text-lg text-muted-foreground mb-4">
              {product.description}
            </p>

            <div className="text-3xl font-bold text-primary mb-6">
              {product.getFormattedPrice()}
            </div>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Stock disponible:</span>
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock} unidades
            </span>
          </div>

          {/* Selector de cantidad */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cantidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  min={1}
                  max={product.stock}
                  className="w-20 text-center"
                />

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {quantity > 1 && (
                <div className="text-sm text-muted-foreground">
                  Subtotal: <strong>{product.getFormattedPrice()} × {quantity} = ${(product.price * quantity).toFixed(2)}</strong>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Botón agregar al carrito */}
          <Button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="w-full h-12 text-lg"
            size="lg"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {product.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
          </Button>

          {/* Información adicional */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información del producto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID:</span>
                <span className="font-medium">#{product.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Categoría:</span>
                <span className="font-medium">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Precio unitario:</span>
                <span className="font-medium">{product.getFormattedPrice()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stock:</span>
                <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock} unidades
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;