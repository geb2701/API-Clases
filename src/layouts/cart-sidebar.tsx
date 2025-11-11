/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <explanation> */
import React from "react";
import { useCartContext } from "@/context/cart-context";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  X,
  ShoppingBag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/features/product/services/upload-service";

interface CartSidebarProps {
  className?: string;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ className }) => {
  const navigate = useNavigate();
  const {
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalItems,
    getProducts,
    getFormattedTotal,
  } = useCartContext();

  const items = getProducts();

  if (!isOpen) return null;

  return (
    <div
      className={cn("fixed inset-0 z-50 bg-black/50", className)}
      onClick={closeCart}
    >
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Carrito</h2>
              {getTotalItems() > 0 && (
                <Badge variant="secondary">{getTotalItems()}</Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeCart}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Botones de acción y total - Parte superior */}
          {items.length > 0 && (
            <>
              <div className="border-b px-6 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-lg font-bold">{getFormattedTotal()}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="flex-1"
                  >
                    Vaciar carrito
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      closeCart();
                      navigate({ to: "/checkout" });
                    }}
                  >
                    Finalizar compra
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium">Tu carrito está vacío</h3>
                <p className="text-sm text-muted-foreground">
                  Agrega algunos productos para comenzar
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.product.id} className="overflow-hidden">
                    <div className="flex gap-3 p-3">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                        <img
                          src={getImageUrl(item.product.image)}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex flex-1 flex-col gap-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link
                              to="/productos/$id"
                              params={{ id: String(item.product.id) }}
                              className="text-sm font-medium leading-tight text-blue-600 hover:underline"
                              onClick={() => closeCart()}
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-xs text-muted-foreground">
                              {item.product.category.name}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.product.id)}
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="h-6 w-6 p-0"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="h-6 w-6 p-0"
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {item.formattedTotal}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ${item.product.discount ? item.product.discount : item.product.price} c/u
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Stock: {item.product.stock - item.quantity} disponibles
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Reservado para posibles elementos adicionales */}
        </div>
      </div>
    </div>
  );
};
