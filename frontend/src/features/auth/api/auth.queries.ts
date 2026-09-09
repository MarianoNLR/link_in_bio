import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { login, register, getMe, logout } from './auth.api';
import { setAuthTokens, getAccessToken, removeAccessToken } from '../lib/auth-token';
import { ApiError } from '@/api/api-error';

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await queryClient.cancelQueries();
      queryClient.clear();
      window.location.replace('/');
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: register,

    onSuccess: (response) => {
      setAuthTokens(response);
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      setAuthTokens(response);
    },
  });
}

export function useMe() {
  const token = getAccessToken();

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getCurrentUser,
    enabled: !!token,
    retry: false,
  });
}

async function getCurrentUser() {
  try {
    return await getMe();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      removeAccessToken();
    }

    throw error;
  }
}
