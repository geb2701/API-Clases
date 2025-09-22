import React from "react";
import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface NoProductsFoundProps {
  searchQuery?: string;
  category?: string | null;
  showOffers?: boolean;
}

export const NoProductsFound: React.FC<NoProductsFoundProps> = ({
  searchQuery,
  category,
  showOffers,
}) => {
  const hasFilters = searchQuery || category || showOffers;

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center text-center p-8">
          <div className="mb-4 p-4 rounded-full bg-muted">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          
          <h3 className="text-lg font-semibold mb-2">
            {hasFilters ? "No se encontraron productos" : "No hay productos disponibles"}
          </h3>
          
          <p className="text-sm text-muted-foreground">
            {hasFilters ? (
              <>
                No se encontraron productos que coincidan con tus criterios de búsqueda.
                {searchQuery && (
                  <span className="block mt-1">
                    <strong>Búsqueda:</strong> "{searchQuery}"
                  </span>
                )}
                {category && (
                  <span className="block mt-1">
                    <strong>Categoría:</strong> {category}
                  </span>
                )}
                {showOffers && (
                  <span className="block mt-1">
                    <strong>Filtro:</strong> Solo ofertas
                  </span>
                )}
              </>
            ) : (
              "Actualmente no hay productos disponibles en la tienda."
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
