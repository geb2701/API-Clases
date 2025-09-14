import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Signup01 } from "@/components/auth/signup01";
import { useAuthContext } from "@/context/auth-context";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const { signup } = useAuthContext();
  const router = useRouter();

  return (
    <div className="container mx-auto px-4">
      <Signup01
        onSuccess={async (values) => {
          const ok = await signup(values);
          if (ok) router.navigate({ to: "/" });
          else alert("Ya existe un usuario con ese email");
        }}
      />
    </div>
  );
}
