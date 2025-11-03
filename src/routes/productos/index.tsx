import ProductosPage from '@/features/product/pages/page'
import { createFileRoute } from '@tanstack/react-router'
import { getProducts } from '@/features/product/services/product-service'

export const Route = createFileRoute('/productos/')({
  component: ProductosPage,
  loader: async ({ context }) => {
    // Precargar productos para la página de productos
    const queryOptions = {
      queryKey: ["productos-paginated"],
      queryFn: getProducts,
    };
    await context.queryClient.ensureQueryData(queryOptions);
  },
})
