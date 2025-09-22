import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/gestionar')({
  loader: () => ({
    crumb: {
      label: "Gestionar",
    },
  }),
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isLogged) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
})