import { useMutation, useQuery } from '@tanstack/react-query';
import { login, register, getMe } from './auth.api';
import { setAccessToken, getAccessToken, removeAccessToken } from '../lib/auth-token';
import { ApiError } from '@/api/api-error';

export function useRegister() {
  return useMutation({
    mutationFn: register,

    onSuccess: (response) => {
      setAccessToken(response.accessToken);
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      setAccessToken(response.accessToken);
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