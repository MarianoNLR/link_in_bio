import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/register.schema"
import { useRegister } from "@/features/auth/api/auth.queries"
import { useNavigate } from "react-router-dom"

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      displayName: "",
      password: "",
      confirmPassword: "",
    },
  })
  const navigate = useNavigate()
  const registerMutation = useRegister()
  const [registerError, setRegisterError] = useState<string | null>(null)

  const onSubmit = (data: RegisterFormValues) => {
    setRegisterError(null)
    registerMutation.mutate(data, {
      onSuccess: () => {
        navigate("/app/profile")
      },
      onError: () => {
        setRegisterError("No se pudo crear la cuenta. Intentá de nuevo.")
      },
    })
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "register-email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="register-email-error" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-username">Nombre de usuario</Label>
        <Input
          id="register-username"
          type="text"
          autoComplete="username"
          aria-invalid={Boolean(errors.username)}
          aria-describedby={
            errors.username ? "register-username-error" : undefined
          }
          {...register("username")}
        />
        {errors.username && (
          <p id="register-username-error" className="text-sm text-destructive">
            {errors.username.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-display-name">Nombre para mostrar</Label>
        <Input
          id="register-display-name"
          type="text"
          autoComplete="name"
          aria-invalid={Boolean(errors.displayName)}
          aria-describedby={
            errors.displayName ? "register-display-name-error" : undefined
          }
          {...register("displayName")}
        />
        {errors.displayName && (
          <p
            id="register-display-name-error"
            className="text-sm text-destructive"
          >
            {errors.displayName.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password">Contraseña</Label>
        <Input
          id="register-password"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={
            errors.password ? "register-password-error" : undefined
          }
          {...register("password")}
        />
        {errors.password && (
          <p id="register-password-error" className="text-sm text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-confirm-password">Confirmar contraseña</Label>
        <Input
          id="register-confirm-password"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
          aria-describedby={
            errors.confirmPassword
              ? "register-confirm-password-error"
              : undefined
          }
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p
            id="register-confirm-password-error"
            className="text-sm text-destructive"
          >
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {registerError && (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-center text-sm text-destructive"
        >
          {registerError}
        </p>
      )}

      <Button
        className="w-full cursor-pointer"
        type="submit"
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? "Creando cuenta..." : "Crear cuenta"}
      </Button>
    </form>
  )
}
