import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteAvatar, getProfile, updateProfile, getPublicProfile, uploadAvatar } from './profile.api'

export function useProfile() {
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: getProfile,
  })
}

export function useUpdateProfile() {
   const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateProfile,

    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['profile', 'me'], updatedProfile)
    }
  })
}

export function usePublicProfile(username: string) {
  return useQuery({
    queryKey: ['profile', username],
    queryFn: () => getPublicProfile(username),
  })
}

export function useUploadAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadAvatar,

    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(
        ['profile', 'me'],
        updatedProfile,
      )
    },
  })
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAvatar,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['profile', 'me'], updatedProfile)
    },
  })
}