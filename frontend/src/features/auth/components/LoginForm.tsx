import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login.schema"
import { useLogin } from "@/features/auth/api/auth.queries"
import { useNavigate } from "react-router-dom"
import { ApiError } from "@/api/api-error"

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const [loginError, setLoginError] = useState<string | null>(null)

  const onSubmit = (data: LoginFormValues) => {
    setLoginError(null)
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate("/app/profile")
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 401) {
          setLoginError("Correo o contraseña incorrectos.")
          return
        }

        setLoginError("No se pudo iniciar sesión. Intentá de nuevo.")
      },
    })
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "login-email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="login-email-error" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password">Contraseña</Label>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "login-password-error" : undefined}
          {...register("password")}
        />
        {errors.password && (
          <p id="login-password-error" className="text-sm text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      {loginError && (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {loginError}
        </p>
      )}

      <Button className="w-full cursor-pointer" type="submit">
        Iniciar sesión
      </Button>
    </form>
  )
}
