import { LoginPage } from "@/features/login/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login/")({
  component: LoginPage,
  loader: () => ({
    crumb: {
      label: "Iniciar Sesión",
    },
  }),
  // Permitir acceso incluso si ya está logueado para debugging
  beforeLoad: () => {
    // Permitir acceso siempre a la página de login
  },
});