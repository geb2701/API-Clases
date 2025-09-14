import React, { useId, useMemo, useState } from "react";
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
import ImageLazy from "./image-lazy";
import type { Product } from "@/types/product";

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
  const [qty, setQty] = useState(clamp(defaultQty, min, maxAllowed));

  const inc = () => setQty((q) => clamp(q + 1, min, maxAllowed));
  const dec = () => setQty((q) => clamp(q - 1, min, maxAllowed));
  const onQtyChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = Number(e.target.value);
    if (Number.isNaN(val)) return;
    setQty(clamp(val, min, maxAllowed));
  };

  const disabled = maxAllowed <= 0;

  const onAddToCart = (id: number, quantity: number) => {
    console.log(`Agregar al carrito: Producto ID ${id}, Cantidad: ${quantity}`);
  };

  const onViewDetail = (id: number) => {
    console.log(`Ver detalle del producto ID ${id}`);
  };

  return (
    <Card className={`overflow-hidden group ${className ?? ""}`}>
      {/* Imagen */}
      <div className="aspect-square w-full overflow-hidden bg-muted/30 flex items-center justify-center">
        <ImageLazy
          src={`http://localhost:3000/${p.image}`}
          alt={p.name}
          className="block max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Header */}
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight">{p.name}</CardTitle>
          <Badge variant="secondary" className="shrink-0">
            {p.category}
          </Badge>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="pt-0">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {p.description}
        </p>

        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-lg font-semibold">
            {currencySymbol}
            {p.price.toFixed(2)}
          </p>
          {qty > 1 && (
            <span className="text-sm text-muted-foreground">
              × {qty} ={" "}
              <strong>
                {currencySymbol}
                {(p.price * qty).toFixed(2)}
              </strong>
            </span>
          )}
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
            onClick={() => onViewDetail?.(p.id)}
          >
            Ver detalle
          </Button>

          <Button
            size="sm"
            className="w-full"
            onClick={() => onAddToCart?.(p.id, qty)}
            disabled={disabled}
          >
            Agregar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
