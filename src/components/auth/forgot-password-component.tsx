import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type Props = {
  onSuccess?: () => void;
  onBackToLogin?: () => void;
};

export const ForgotPasswordComponent = ({ onSuccess, onBackToLogin }: Props) => {
  const [email, setEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showVideo, setShowVideo] = React.useState(false);

  const validate = (): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Email inválido";
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setError(null);
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 1000)); // simulación
      setShowVideo(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (showVideo) {
    return (
      <div className="grid min-h-[calc(100dvh-4rem)] place-items-center py-6">
        <Card className="w-full max-w-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">¡Sorpresa! 🎉</CardTitle>
            <CardDescription>
              Te enviamos un enlace para restablecer tu contraseña... pero primero, ¡disfruta de esta canción!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0"
                title="Rick Astley - Never Gonna Give You Up"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                ¡Gracias por tu paciencia! Tu enlace de recuperación ha sido enviado a {email}
              </p>
              <Button onClick={() => onBackToLogin?.()} className="w-full">
                Continuar al Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid min-h-[calc(100dvh-4rem)] place-items-center py-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Recuperar contraseña</CardTitle>
          <CardDescription>
            Ingresá tu email y te enviaremos un enlace para restablecer tu contraseña
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit} noValidate>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vos@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Enviando..." : "Enviar enlace"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => onBackToLogin?.()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
