import { AuthCard } from "@/features/auth/components/AuthCard"
import { Navigate } from "react-router-dom"
import { useMe } from "@/features/auth/api/auth.queries"

export function AuthPage() {
  const { data: user, isLoading } = useMe()

  if (isLoading) {
    return <p>Cargando...</p>
  }

  if (user) {
    return <Navigate to="/app/profile" replace />
  }
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
      <AuthCard />
    </main>
  )
}
