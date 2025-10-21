import { ForgotPasswordComponent } from "@/components/auth/forgot-password-component";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

export const ForgotPasswordPage = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4">
      <ForgotPasswordComponent
        onSuccess={() => {
          toast.success("Email enviado", {
            description: "Te enviamos un enlace para restablecer tu contraseña. Revisa tu correo.",
            duration: 5000,
          });
          router.navigate({ to: "/login" });
        }}
        onBackToLogin={() => router.navigate({ to: "/login" })}
      />
    </div>
  );
};
