import { createFileRoute } from "@tanstack/react-router";
import CheckoutPage from "@/features/checkout/page";

export const Route = createFileRoute("/checkout/")({
  component: CheckoutPage,
  loader: () => ({
    crumb: {
      label: "Checkout",
    },
  }),
});