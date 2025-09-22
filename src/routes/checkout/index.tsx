import { createFileRoute, redirect } from "@tanstack/react-router";
import CheckoutPage from "@/features/checkout/page";

export const Route = createFileRoute("/checkout/")({
  component: CheckoutPage,
  loader: () => ({
    crumb: {
      label: "Checkout",
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
});