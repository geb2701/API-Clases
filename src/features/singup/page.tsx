
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
          const ok = await signup(values);
          if (ok) {
            toast.success("¡Cuenta creada!", {
              description: "Tu cuenta ha sido creada exitosamente. Bienvenido!",
            });
            router.navigate({ to: "/" });
          } else {
            toast.error("Error al registrarse", {
              description: "Ya existe un usuario con ese email. Intenta con otro.",
            });
          }
        }}
      />
    </div>
  );
}
