import { ApiError } from "./api-error"

export function isServerUnavailable(error: unknown) {
  return (
    error instanceof ApiError && (error.status === 0 || error.status >= 500)
  )
}
