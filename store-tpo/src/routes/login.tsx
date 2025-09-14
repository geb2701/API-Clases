import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Login01 } from "@/components/auth/login01";
import { useAuthContext } from "@/context/auth-context";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuthContext();
  const router = useRouter();

  return (
    <div className="container mx-auto px-4">
      <Login01
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
