import { Button } from "@/components/ui/button"
import { useSearchParams } from "react-router-dom"

export function ServerUnavailablePage() {
  const [searchParams] = useSearchParams()
  const returnTo = searchParams.get("returnTo")
  const destination =
    returnTo?.startsWith("/") && !returnTo.startsWith("//")
      ? returnTo
      : "/"

  return (
    <section className="flex flex-1 items-center justify-center px-6 py-20">
      <div
        role="alert"
        className="w-full max-w-md rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-center text-destructive shadow-lg"
      >
        <h1 className="text-lg font-semibold">
          El servidor no está disponible
        </h1>
        <p className="mt-2 text-sm">
          Esperá unos minutos antes de volver a intentarlo.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-5 cursor-pointer"
          onClick={() => window.location.replace(destination)}
        >
          Volver a intentar
        </Button>
      </div>
    </section>
  )
}
