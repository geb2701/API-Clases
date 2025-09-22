import { LoginPage } from "@/features/login/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login/")({
  component: LoginPage,
  loader: () => ({
    crumb: {
      label: "Iniciar Sesión",
    },
  }),
});