import React, { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import ImageLazy from "./image-lazy";
import { ImageModal } from "./image-modal";
import type { Product } from "@/types/product";
import { getImageUrl } from "@/features/product/services/upload-service";
import { useCartContext } from "@/context/cart-context";
import { categoryToSlug } from "@/lib/helpers";

type ProductCardProps = {
  product: Product;
  className?: string;
  defaultQty?: number;
  min?: number; // por defecto 1
  max?: number; // por defecto 99 o stock
  currencySymbol?: string; // por defecto "$"
};

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

export const ProductCard = ({
  product: p,
  className,
  defaultQty = 1,
  min = 1,
  max,
  currencySymbol = "$",
}: ProductCardProps) => {
  const maxAllowed = useMemo(
    () => (typeof max === "number" ? max : p.stock ?? 99),
    [max, p.stock]
  );
  const { addItem } = useCartContext();
  const [qty, setQty] = useState(clamp(defaultQty, min, maxAllowed));

  const inc = () => setQty((q) => clamp(q + 1, min, maxAllowed));
  const dec = () => setQty((q) => clamp(q - 1, min, maxAllowed));
  const onQtyChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = Number(e.target.value);
    if (Number.isNaN(val)) return;
    setQty(clamp(val, min, maxAllowed));
  };

  const disabled = maxAllowed <= 0;

  const onAddToCart = (quantity: number) => {
    addItem(p, quantity);
  };

  const imageUrl = getImageUrl(p.image);

  return (
    <Card className={`overflow-hidden group ${className ?? ""}`}>
      {/* Imagen */}
      <div className="aspect-square w-full overflow-hidden bg-muted/30 flex items-center justify-center">
        <ImageModal
          src={imageUrl}
          alt={p.name}
          trigger={
            <div className="block max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105 cursor-pointer">
              <ImageLazy
                src={imageUrl}
                alt={p.name}
                className="block max-h-full max-w-full object-contain"
              />
            </div>
          }
        />
      </div>

      {/* Header */}
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight">{p.name}</CardTitle>
          <Badge
            variant="secondary"
            className="shrink-0 cursor-pointer hover:bg-secondary/80 transition-colors"
            asChild
          >
            <Link to="/productos/categorias/$nombre" params={{ nombre: categoryToSlug(p.category?.name ?? '') }}>
              {p.category?.name ?? 'Sin categoría'}
            </Link>
          </Badge>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="pt-0">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {p.description}
        </p>

        <div className="mt-2 flex items-baseline gap-2">
          <div className="flex items-center gap-2">
            {(p.discount ?? 0) > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                {p.getFormattedPrice()}
              </span>
            )}
            <span className="text-sm font-semibold text-green-600">
              {p.getFormattedDiscountPrice()}
            </span>
          </div>
          {qty > 1 && (
            <span className="text-sm text-muted-foreground">
              × {qty} ={" "}
              <strong>
                {currencySymbol}
                {(p.getActualPrice() * qty).toFixed(2)}
              </strong>
            </span>
          )}
        </div>

        {/* Stock Information */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Stock:</span>
          <span className={`text-xs font-medium ${p.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {p.stock} unidades
          </span>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex flex-col gap-3">
        {/* Contador */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={dec}
            disabled={qty <= min || disabled}
            aria-label="Disminuir cantidad"
          >
            <Minus className="h-4 w-4" />
          </Button>

          <Input
            type="number"
            inputMode="numeric"
            min={min}
            max={maxAllowed}
            value={qty}
            onChange={onQtyChange}
            aria-label="Cantidad"
            className="
              h-9 w-16 text-center
              [appearance:textfield]                   /* Firefox */
              [-moz-appearance:textfield]
              [&::-webkit-inner-spin-button]:appearance-none  /* Chrome/Safari/Edge */
              [&::-webkit-outer-spin-button]:appearance-none
            "
          />

          <Button
            type="button"
            size="sm"
            onClick={inc}
            disabled={qty >= maxAllowed || disabled}
            aria-label="Aumentar cantidad"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Acciones: SIEMPRE visibles, lado a lado en mobile */}
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button
            size="sm"
            variant="secondary"
            className="w-full"
            asChild
          >
            <Link to="/productos/$id" params={{ id: p.id.toString() }}>
              Ver detalle
            </Link>
          </Button>

          <Button
            size="sm"
            className="w-full"
            onClick={() => onAddToCart?.(qty)}
            disabled={disabled}
            variant={disabled ? "destructive" : "default"}
          >
            {disabled ? "Sin stock" : "Agregar"}
          </Button>
        </div>
      </CardFooter>
    </Card >
  );
};
