/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useParams, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import ImageLazy from "@/components/image-lazy";
import { Product } from "@/types/product";
import { ArrowLeft, Save, RotateCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProducts } from "../hooks/use-products";
import { useSuspenseQuery } from "@tanstack/react-query";

const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100, "El nombre es muy largo"),
  description: z.string().min(1, "La descripción es requerida").max(500, "La descripción es muy larga"),
  price: z.number().min(0.01, "El precio debe ser mayor a 0"),
  category: z.string().min(1, "La categoría es requerida"),
  image: z.string().url("Debe ser una URL válida"),
  stock: z.number().min(0, "El stock no puede ser negativo").int("El stock debe ser un número entero"),
  discount: z.number().min(0, "El descuento no puede ser negativo").optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

const categories = [
  "Electrónicos",
  "Ropa",
  "Hogar",
  "Deportes",
  "Libros",
  "Juguetes",
  "Belleza",
  "Automotriz",
  "Otros"
];

export default function EditProduct() {
  const api = useProducts();
  const mockProducts = useSuspenseQuery(api.queryOptions.all()).data;
  const { productId } = useParams({ from: "/gestionar/editar/$productId" });
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  // Cargar producto por ID
  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));

      const foundProduct = mockProducts.find(p => p.id === parseInt(productId));

      if (foundProduct) {
        setProduct(foundProduct);
        setPreviewImage(foundProduct.image);

        // Llenar formulario con datos del producto
        reset({
          name: foundProduct.name,
          description: foundProduct.description,
          price: foundProduct.price,
          category: foundProduct.category,
          image: foundProduct.image,
          stock: foundProduct.stock,
          discount: foundProduct.discount,
        });
      } else {
        toast.error("Producto no encontrado", {
          description: "El producto que intentas editar no existe.",
        });
      }

      setIsLoading(false);
    };

    loadProduct();
  }, [productId, reset, mockProducts.find]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("image", value);
    setPreviewImage(value);
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!product) return;

    setIsSubmitting(true);

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Crear producto actualizado
      const updatedProduct = new Product(
        product.id,
        data.name,
        data.description,
        data.price,
        data.category,
        data.image,
        data.stock,
        data.discount
      );

      // Simular actualización exitosa
      console.log("Producto actualizado:", updatedProduct);

      toast.success("¡Producto actualizado exitosamente!", {
        description: `El producto "${data.name}" ha sido modificado correctamente.`,
      });

      // Actualizar estado local
      setProduct(updatedProduct);

    } catch {
      toast.error("Error al actualizar el producto", {
        description: "Hubo un problema al modificar el producto. Inténtalo de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        image: product.image,
        stock: product.stock,
        discount: product.discount,
      });
      setPreviewImage(product.image);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando producto...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Producto no encontrado</h3>
              <p className="text-muted-foreground mb-4">
                El producto que intentas editar no existe o ha sido eliminado.
              </p>
              <Link to="/productos">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a Productos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Editar Producto</h1>
            <p className="text-muted-foreground mt-2">
              Modifica la información del producto
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Producto *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Ej: Camiseta React"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Describe las características del producto..."
                rows={4}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Precio *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="0.00"
                  className={errors.price ? "border-destructive" : ""}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Precio con Descuento</Label>
                <Input
                  id="discount"
                  type="number"
                  step="0.01"
                  {...register("discount", { valueAsNumber: true })}
                  placeholder="0.00"
                  className={errors.discount ? "border-destructive" : ""}
                />
                {errors.discount && (
                  <p className="text-sm text-destructive">{errors.discount.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select onValueChange={(value) => setValue("category", value)} defaultValue={product.category}>
                <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                type="number"
                {...register("stock", { valueAsNumber: true })}
                placeholder="0"
                className={errors.stock ? "border-destructive" : ""}
              />
              {errors.stock && (
                <p className="text-sm text-destructive">{errors.stock.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL de la Imagen *</Label>
              <Input
                id="image"
                type="url"
                {...register("image")}
                onChange={handleImageChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                className={errors.image ? "border-destructive" : ""}
              />
              {errors.image && (
                <p className="text-sm text-destructive">{errors.image.message}</p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restaurar
              </Button>
            </div>
          </form>
        </div>

        {/* Vista previa */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Vista Previa del Producto</h3>
            <Card>
              <CardContent className="p-4">
                {previewImage ? (
                  <div className="space-y-4">
                    <div className="aspect-square w-full overflow-hidden rounded-lg">
                      <ImageLazy
                        src={previewImage}
                        alt="Vista previa del producto"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">
                        {watch("name") || "Nombre del producto"}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {watch("description") || "Descripción del producto"}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-2xl font-bold">
                          {watch("price") ? `$${watch("price").toFixed(2)}` : "$0.00"}
                        </span>
                        {watch("discount") && watch("discount") < watch("price") && (
                          <span className="text-lg text-muted-foreground line-through">
                            ${watch("price").toFixed(2)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Categoría: {watch("category") || "Sin categoría"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Stock: {watch("stock") || 0} unidades
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square w-full bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Vista previa aparecerá aquí</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
