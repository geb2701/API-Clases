
import { SignupComponent } from "@/components/auth/signup-component";
import { useAuthContext } from "@/context/auth-context";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

export const SignupPage = () => {
  const { signup } = useAuthContext();
  const router = useRouter();

  return (
    <div className="container mx-auto px-4">
      <SignupComponent
        onSuccess={async (values) => {
          try {
            const ok = await signup(values);
            if (ok) {
              toast.success("¡Cuenta creada!", {
                description: "Tu cuenta ha sido creada exitosamente. Bienvenido!",
              });
              router.navigate({ to: "/" });
            }
          } catch (error) {
            console.error("Error en signup:", error);
            const errorMessage = error instanceof Error ? error.message : "Error desconocido";
            toast.error("Error al registrarse", {
              description: errorMessage || "No se pudo crear la cuenta. Verifica que el email no esté en uso y que todos los campos sean correctos.",
            });
          }
        }}
      />
    </div>
  );
}
