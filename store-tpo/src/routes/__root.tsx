import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import MainLayout from "@/layouts/main-layout";
import type { QueryClient } from "@tanstack/react-query";

import "@/styles.css";

interface MyRouterContext {
	queryClient: QueryClient;
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
				content: "Web Application",
			},
			{
				title: "WebApp",
			},
		],
		links: [
			{
				rel: "icon",
				href: "/favicon.ico",
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
			{false && (
				<>
					<ReactQueryDevtools buttonPosition="bottom-right" />
					<TanStackRouterDevtools position="bottom-left" />
				</>
			)}
		</>
	),
});
