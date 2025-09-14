import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

type FormValues = { name: string; surname: string; email: string; password: string }
type Props = { onSuccess?: (values: FormValues) => void }

export function Signup01({ onSuccess }: Props) {
  const [values, setValues] = React.useState<FormValues>({
    name: "", surname: "", email: "", password: ""
  })
  const [show, setShow] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const setField = (k: keyof FormValues) => (v: string) =>
    setValues((s) => ({ ...s, [k]: v }))

  const validate = (): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!values.name.trim()) return "Ingresá tu nombre"
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
      await new Promise((r) => setTimeout(r, 600)) // simulación
      onSuccess?.(values)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-[calc(100dvh-4rem)] place-items-center py-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Crear cuenta</CardTitle>
          <CardDescription>Completá tus datos para registrarte</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit} noValidate>
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" value={values.name} onChange={(e) => setField("name")(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="surname">Apellido (opcional)</Label>
              <Input id="surname" value={values.surname} onChange={(e) => setField("surname")(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={values.email} onChange={(e) => setField("email")(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
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
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                  onClick={() => setShow((s) => !s)}
                >
                  {show ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Creando…" : "Crear cuenta"}
            </Button>
          </form>
        </CardContent>
        <CardFooter />
      </Card>
    </div>
  )
}
