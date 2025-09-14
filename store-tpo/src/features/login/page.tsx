import { LoginComponent } from "@/components/auth/login-component";
import { useAuthContext } from "@/context/auth-context";
import { useRouter } from "@tanstack/react-router";

export const LoginPage = () => {
  const { login } = useAuthContext();
  const router = useRouter();

  return (
    <div className="container mx-auto px-4">
      <LoginComponent
        onSuccess={async ({ email, password }) => {
          const ok = await login(email, password);
          if (ok) router.navigate({ to: "/" });
          else alert("Credenciales inválidas");
        }}
        onForgotPassword={() => router.navigate({ to: "/forgot" })}
        onSignup={() => router.navigate({ to: "/signup" })}
      />
    </div>
  );
}