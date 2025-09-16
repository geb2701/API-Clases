/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageLazy from "@/components/image-lazy";
import { Product } from "@/types/product";

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

export default function AddProduct() {
  const [previewImage, setPreviewImage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      image: "",
      stock: 0,
      discount: undefined,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("image", value);
    setPreviewImage(value);
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newProduct = new Product(
        Date.now(), // ID temporal
        data.name,
        data.description,
        data.price,
        data.category,
        data.image,
        data.stock,
        data.discount
      );

      console.log("Producto creado:", newProduct);

      toast.success("¡Producto agregado exitosamente!", {
        description: `El producto "${data.name}" ha sido creado correctamente.`,
      });

      reset();
      setPreviewImage("");

    } catch {
      toast.error("Error al agregar el producto", {
        description: "Hubo un problema al crear el producto. Inténtalo de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Agregar Nuevo Producto</h1>
        <p className="text-muted-foreground mt-2">
          Completa la información del producto que deseas vender
        </p>
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
              <Select onValueChange={(value) => setValue("category", value)}>
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
                {isSubmitting ? "Agregando..." : "Agregar Producto"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setPreviewImage("");
                }}
                disabled={isSubmitting}
              >
                Limpiar
              </Button>
            </div>
          </form>
        </div>

        {/* Vista previa */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Vista Previa del Producto</h3>
            <div className="border rounded-lg p-4 bg-card">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
