import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import MainLayout from "@/layouts/main-layout";
import type { QueryClient } from "@tanstack/react-query";

import "@/styles.css";
import type { AuthState } from "@/context/auth-context";

interface MyRouterContext {
	queryClient: QueryClient;
	auth: AuthState;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "UTF-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1.0",
			},
			{
				name: "description",
				content: "ChangoClick - Tu tienda online de confianza",
			},
			{
				title: "ChangoClick - Tienda Online",
			},
		],
		links: [
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml",
			},
			{
				rel: "manifest",
				href: "/manifest.json",
			},
			/*{
				rel: "stylesheet",
				href: appCss,
			},*/
		],
	}),
	component: () => (
		<>
			<MainLayout />
			{true && (
				<>
					<ReactQueryDevtools buttonPosition="bottom-right" />
					<TanStackRouterDevtools position="bottom-left" />
				</>
			)}
		</>
	),
});
