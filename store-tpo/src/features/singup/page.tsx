
import { SignupComponent } from "@/components/auth/signup-Component";
import { useAuthContext } from "@/context/auth-context";
import { useRouter } from "@tanstack/react-router";

export const SignupPage = () => {
  const { signup } = useAuthContext();
  const router = useRouter();

  return (
    <div className="container mx-auto px-4">
      <SignupComponent
        onSuccess={async (values) => {
          const ok = await signup(values);
          if (ok) router.navigate({ to: "/" });
          else alert("Ya existe un usuario con ese email");
        }}
      />
    </div>
  );
}
