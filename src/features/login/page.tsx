import { LoginComponent } from "@/components/auth/login-component";
import { useAuthContext } from "@/context/auth-context";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

export const LoginPage = () => {
  const { login } = useAuthContext();
  const router = useRouter();

  return (
    <div className="container mx-auto px-4">
      <LoginComponent
        onSuccess={async ({ email, password }) => {
          const ok = await login(email, password);
          if (ok) {
            toast.success("¡Bienvenido!", {
              description: "Has iniciado sesión correctamente",
            });
            router.navigate({ to: "/" });
          } else {
            toast.error("Error de autenticación", {
              description: "Credenciales inválidas. Por favor, verifica tu email y contraseña.",
            });
          }
        }}
        onForgotPassword={() => router.navigate({ to: "/forgot" })}
        onSignup={() => router.navigate({ to: "/signup" })}
      />
    </div>
  );
}