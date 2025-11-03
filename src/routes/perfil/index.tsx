import { createFileRoute, redirect } from "@tanstack/react-router";
import ProfilePage from "@/features/user/pages/profile";
import { getMyOrders } from "@/features/order/services/order-service";

export const Route = createFileRoute("/perfil/")({
	component: ProfilePage,
	loader: async ({ context }) => {
		// Precargar órdenes del usuario para el historial
		await context.queryClient.ensureQueryData({
			queryKey: ["orders", "my-orders"],
			queryFn: getMyOrders,
		});
		return {
			crumb: {
				label: "Mi Perfil",
			},
		};
	},
	beforeLoad: ({ context, location }) => {
		if (!context.auth.isLogged) {
			throw redirect({
				to: "/login",
				search: {
					redirect: location.href,
				},
			});
		}
	},
});
