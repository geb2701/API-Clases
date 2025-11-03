import { LoginComponent } from "@/components/auth/login-component";
import { DebugAuth } from "@/components/auth/debug-auth";
import { useAuthContext } from "@/context/auth-context";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

export const LoginPage = () => {
  const { login } = useAuthContext();
  const router = useRouter();

  // Mostrar debug solo en desarrollo
  const showDebug = import.meta.env.DEV || window.location.search.includes("debug=true");

  return (
    <div className="container mx-auto px-4 py-8">
      {showDebug && <DebugAuth />}
      <LoginComponent
        onSuccess={async ({ email, password }) => {
          try {
            const ok = await login(email, password);
            if (ok) {
              toast.success("¡Bienvenido!", {
                description: "Has iniciado sesión correctamente",
              });
              router.navigate({ to: "/" });
            } else {
              toast.error("Error de autenticación", {
                description: "Credenciales inválidas. Por favor, verifica tu email y contraseña. Si no tienes cuenta, puedes registrarte.",
              });
              // Lanzar error para que el componente lo capture
              throw new Error("Credenciales inválidas");
            }
          } catch (error) {
            console.error("Error en login:", error);
            toast.error("Error de autenticación", {
              description: error instanceof Error ? error.message : "No se pudo conectar con el servidor. Por favor, intenta nuevamente.",
            });
            // Re-lanzar el error para que el componente lo muestre
            throw error;
          }
        }}
        onForgotPassword={() => router.navigate({ to: "/forgot" })}
        onSignup={() => router.navigate({ to: "/signup" })}
      />
    </div>
  );
}