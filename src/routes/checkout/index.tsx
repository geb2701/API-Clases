import { createFileRoute, redirect } from "@tanstack/react-router";
import CheckoutPage from "@/features/checkout/page";
import { getProducts } from "@/features/product/services/product-service";

export const Route = createFileRoute("/checkout/")({
  component: CheckoutPage,
  loader: async ({ context }) => {
    // Precargar productos para validar stock en checkout
    await context.queryClient.ensureQueryData({
      queryKey: ["productos-paginated"],
      queryFn: getProducts,
    });
    return {
      crumb: {
        label: "Checkout",
      },
    };
  },
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