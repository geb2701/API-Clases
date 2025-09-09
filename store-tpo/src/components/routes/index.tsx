import { HomePage } from "@/features/inicio/pages/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: HomePage,
});
