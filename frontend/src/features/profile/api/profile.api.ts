import { apiClient } from '@/api/client'
import type { PublicLink } from '@/features/links/link.types'

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

export type PublicProfile = Pick<Profile, 'username' | 'displayName' | 'bio' | 'avatarUrl'> & {
  theme: 'LIGHT' | 'DARK' | 'MIDNIGHT' | 'GRADIENT'
  links: PublicLink[]
}

export function getPublicProfile(username: string) {
  return apiClient.get<PublicProfile>(`/profiles/${username}`)
}

export function uploadAvatar(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return apiClient.postFormData<Profile>('/profiles/me/avatar', formData)
}
