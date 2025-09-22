import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/productos')({
  loader: () => ({
    crumb: {
      label: "Productos",
    },
  }),
})