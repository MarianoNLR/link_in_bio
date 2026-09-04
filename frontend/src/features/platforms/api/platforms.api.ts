import { apiClient } from '@/api/client'
import type { Platform } from '../types/platform.types'

export function getPlatforms() {
  return apiClient.get<Platform[]>('/platforms')
}
