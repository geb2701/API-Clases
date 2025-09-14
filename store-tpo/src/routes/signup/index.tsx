import { SignupPage } from "@/features/singup/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signup/")({
  component: SignupPage,
  loader: () => ({
    crumb: {
      label: "Crear Cuenta",
    },
  }),
});
