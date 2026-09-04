import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProfile, updateProfile } from './profile.api'

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