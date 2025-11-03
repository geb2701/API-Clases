import { createFileRoute, redirect } from "@tanstack/react-router";
import ProfilePage from "@/features/user/pages/profile";

export const Route = createFileRoute("/perfil/")({
	component: ProfilePage,
	loader: () => ({
		crumb: {
			label: "Mi Perfil",
		},
	}),
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
