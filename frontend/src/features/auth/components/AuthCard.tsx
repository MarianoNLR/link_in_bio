import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LoginForm } from "@/features/auth/components/LoginForm"
import { RegisterForm } from "@/features/auth/components/RegisterForm"

type AuthMode = "login" | "register"

export function AuthCard() {
  const [mode, setMode] = useState<AuthMode>("login")
  const isLogin = mode === "login"

  return (
    <Card className="w-full max-w-md text-left">
      <CardHeader>
        <CardTitle>{isLogin ? "Iniciar sesión" : "Crear una cuenta"}</CardTitle>
        <CardDescription>
          {isLogin
            ? "Ingresa tus datos para acceder a tu cuenta."
            : "Completa tus datos para registrarte."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLogin ? <LoginForm /> : <RegisterForm />}
        <div className="mt-4 flex items-center justify-center gap-1 text-sm">
          <span className="text-muted-foreground">
            {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
          </span>
          <Button
            type="button"
            variant="link"
            className="h-auto cursor-pointer px-1 py-0"
            onClick={() => setMode(isLogin ? "register" : "login")}
          >
            {isLogin ? "Regístrate" : "Inicia sesión"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
