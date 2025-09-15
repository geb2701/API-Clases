import { ForgotPasswordComponent } from "@/components/auth/forgot-password-component";
import { useRouter } from "@tanstack/react-router";

export const ForgotPasswordPage = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4">
      <ForgotPasswordComponent
        onSuccess={() => {
          alert("Te enviamos un enlace para restablecer tu contraseña");
          router.navigate({ to: "/login" });
        }}
        onBackToLogin={() => router.navigate({ to: "/login" })}
      />
    </div>
  );
};
