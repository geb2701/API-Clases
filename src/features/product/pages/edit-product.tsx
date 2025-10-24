/** biome-ignore-all lint/correctness/useUniqueElementIds: Multiple inputs with same ID pattern needed for form functionality */
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
import type { Product } from "@/types/product";
import { ArrowLeft, Save, RotateCcw, Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProducts } from "../hooks/use-products";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { uploadImage, getImageUrl } from "../services/upload-service";
import { updateProduct } from "../services/product-service";
import { useNavigate } from "@tanstack/react-router";
import { useCategories } from "@/features/category/hooks/use-categories";

const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100, "El nombre es muy largo"),
  description: z.string().min(1, "La descripción es requerida").max(500, "La descripción es muy larga"),
  price: z.number().min(0.01, "El precio debe ser mayor a 0"),
  category: z.string().min(1, "La categoría es requerida"),
  image: z.string().min(1, "La imagen es requerida"),
  stock: z.number().min(0, "El stock no puede ser negativo").int("El stock debe ser un número entero"),
  discount: z.number().min(0, "El descuento no puede ser negativo").optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function EditProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const api = useProducts();
  const { invalidateKeys } = api;
  const mockProducts = useSuspenseQuery(api.queryOptions.all()).data;
  const categoriesApi = useCategories();
  const categoriesData = useSuspenseQuery(categoriesApi.queryOptions.all()).data;
  const categories = categoriesData.map((cat) => cat.name).sort();
  const { productId } = useParams({ from: "/gestionar/editar/$productId" });
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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
        // Construir URL completa de la imagen
        setPreviewImage(getImageUrl(foundProduct.image));

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
  }, [productId, reset, mockProducts]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      toast.error("Archivo inválido", {
        description: "Por favor selecciona una imagen válida (JPG, PNG, GIF, etc.)",
      });
      return;
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Archivo muy grande", {
        description: "La imagen no debe superar los 5MB",
      });
      return;
    }

    setSelectedFile(file);

    // Crear URL temporal para vista previa
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);

    // Subir imagen inmediatamente
    setIsUploadingImage(true);
    try {
      const uploadResponse = await uploadImage(file);
      setValue("image", uploadResponse.fileName);

      toast.success("Imagen actualizada", {
        description: "La nueva imagen se ha subido correctamente",
      });
    } catch (error) {
      toast.error("Error al subir imagen", {
        description: error instanceof Error ? error.message : "No se pudo subir la imagen",
      });
      // Restaurar imagen original en caso de error
      if (product) {
        setPreviewImage(getImageUrl(product.image));
        setValue("image", product.image);
      }
      setSelectedFile(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveNewImage = () => {
    setSelectedFile(null);

    // Restaurar imagen original del producto
    if (product) {
      setPreviewImage(getImageUrl(product.image));
      setValue("image", product.image);
    }

    // Limpiar el input file
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!product) return;

    setIsSubmitting(true);

    try {
      // Actualizar producto usando la API
      const updatedProduct = await updateProduct(product.id, {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        image: data.image,
        stock: data.stock,
        discount: data.discount,
      });

      toast.success("¡Producto actualizado exitosamente!", {
        description: `El producto "${data.name}" ha sido modificado correctamente.`,
      });

      // Invalidar caché de productos para refrescar la lista
      await queryClient.invalidateQueries({ queryKey: invalidateKeys.paginated });

      // Actualizar estado local
      setProduct(updatedProduct);

      // Redirigir a la página de gestión de productos después de un momento
      setTimeout(() => {
        navigate({ to: '/gestionar/productos' });
      }, 1000);

    } catch (error) {
      toast.error("Error al actualizar el producto", {
        description: error instanceof Error ? error.message : "Hubo un problema al modificar el producto. Inténtalo de nuevo.",
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
        category: product.category.name,
        image: product.image,
        stock: product.stock,
        discount: product.discount,
      });
      setPreviewImage(getImageUrl(product.image));
      setSelectedFile(null);

      // Limpiar el input file
      const fileInput = document.getElementById("image") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
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
              <Select onValueChange={(value) => setValue("category", value)} defaultValue={product.category.name}>
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
              <Label htmlFor="image">Imagen del Producto *</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={errors.image ? "border-destructive" : ""}
                    disabled={isUploadingImage}
                  />
                </div>
                {selectedFile && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleRemoveNewImage}
                    disabled={isUploadingImage}
                    title="Restaurar imagen original"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {isUploadingImage && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Upload className="w-4 h-4 animate-bounce" />
                  Subiendo nueva imagen...
                </p>
              )}
              {errors.image && (
                <p className="text-sm text-destructive">{errors.image.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {selectedFile
                  ? "Nueva imagen seleccionada. Se guardará al enviar el formulario."
                  : "Selecciona una nueva imagen para reemplazar la actual (opcional)"}
              </p>
              <p className="text-xs text-muted-foreground">
                Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 5MB
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting || isUploadingImage} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSubmitting || isUploadingImage}
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
