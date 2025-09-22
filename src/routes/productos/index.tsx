import ProductosPage from '@/features/product/pages/page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/productos/')({
  component: ProductosPage,
})
