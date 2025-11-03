/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff } from "lucide-react"

// Google icon component
const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
)


type FormValues = { email: string; password: string }
type Props = {
  onSuccess?: (values: FormValues & { remember: boolean }) => void
  onForgotPassword?: () => void
  onSignup?: () => void
}

export const LoginComponent = ({ onSuccess, onForgotPassword, onSignup }: Props) => {
  const [values, setValues] = React.useState<FormValues>({ email: "", password: "" })
  const [remember, setRemember] = React.useState(false)
  const [show, setShow] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const setField =
    (k: keyof FormValues) =>
      (v: string) =>
        setValues((s) => ({ ...s, [k]: v }))

  const validate = (): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(values.email)) return "Email inválido"
    if (values.password.length < 6) return "La contraseña debe tener al menos 6 caracteres"
    return null
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) return setError(err)
    setError(null)
    setSubmitting(true)
    try {
      // Llamar al callback onSuccess que manejará la llamada a la API
      await onSuccess?.({ ...values, remember })
    } catch (error) {
      // Si hay un error, lo mostramos en el componente
      setError(error instanceof Error ? error.message : "Error al iniciar sesión")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-[calc(100dvh-4rem)] place-items-center py-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
          <CardDescription>Accedé con tu email y contraseña</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={onSubmit} noValidate>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vos@ejemplo.com"
                value={values.email}
                onChange={(e) => setField("email")(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:underline"
                  onClick={() => onForgotPassword?.()}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  placeholder="********"
                  value={values.password}
                  onChange={(e) => setField("password")(e.target.value)}
                />
                <button
                  type="button"
                  aria-label="Mostrar/ocultar contraseña"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                  onClick={() => setShow((s) => !s)}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(checked) => setRemember(checked === true)}
              />
              <Label htmlFor="remember" className="text-sm text-muted-foreground">
                Recordarme en este dispositivo
              </Label>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Ingresando…" : "Ingresar"}
            </Button>
          </form>

          <div className="space-y-4">
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                o continúa con
              </span>
            </div>
            <Button variant="outline" className="w-full" onClick={() => alert("Google OAuth")}>
              <GoogleIcon />
              <span className="ml-2">Continuar con Google</span>
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            ¿No tenés cuenta?{" "}
            <button
              className="underline underline-offset-4 hover:text-foreground"
              onClick={() => onSignup?.()}
            >
              Crear cuenta
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
