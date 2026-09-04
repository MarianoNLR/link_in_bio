import { useQuery } from '@tanstack/react-query'
import { getPlatforms } from './platforms.api'

export function usePlatforms() {
  return useQuery({
    queryKey: ['platforms'],
    queryFn: getPlatforms,
  })
}
