/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Github, Mail } from "lucide-react"


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
      await new Promise((r) => setTimeout(r, 600))
      onSuccess?.({ ...values, remember })
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
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="w-full" onClick={() => alert("GitHub OAuth")}>
                <Github className="mr-2 h-4 w-4" /> GitHub
              </Button>
              <Button variant="outline" className="w-full" onClick={() => alert("Magic Link")}>
                <Mail className="mr-2 h-4 w-4" /> Magic Link
              </Button>
            </div>
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
