import { apiClient } from '@/api/client';

export type AuthUser = {
  id: string;
  email: string;
  username: string;
  displayName: string;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  email: string;
  username: string;
  displayName: string;
  password: string;
  confirmPassword: string;
};

export function login(data: LoginInput) {
  return apiClient.post<AuthResponse>('/auth/login', data);
}

export function register(data: RegisterInput) {
  return apiClient.post<AuthResponse>('/auth/register', data);
}

export function getMe() {
  return apiClient.get<AuthUser>('/auth/me');
}