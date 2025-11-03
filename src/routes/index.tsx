import HomePage from '@/features/home/page'
import { createFileRoute } from '@tanstack/react-router'
import { queryOptions } from '@tanstack/react-query'
import { getProducts } from '@/features/product/services/product-service'

export const Route = createFileRoute('/')({
  component: HomePage,
  loader: async ({ context }) => {
    // Precargar productos para la página de inicio
    const queryOptions = {
      queryKey: ["productos-paginated"],
      queryFn: getProducts,
    };
    await context.queryClient.ensureQueryData(queryOptions);
  },
})