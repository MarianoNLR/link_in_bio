import { apiClient } from '@/api/client'

export type Profile = {
  id: string
  username: string
  displayName: string
  bio: string | null
  avatarUrl: string | null
  isPublic: boolean
}

export function getProfile() {
  return apiClient.get<Profile>('/profiles/me')
}

export function updateProfile(profileData: Partial<Profile>) {
  return apiClient.patch<Profile>('/profiles/me', profileData)
}