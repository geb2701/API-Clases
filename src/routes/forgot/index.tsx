import { ForgotPasswordPage } from "@/features/forgot-password/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/forgot/")({
  component: ForgotPasswordPage,
  loader: () => ({
    crumb: {
      label: "Recuperar Contraseña",
    },
  }),
});
