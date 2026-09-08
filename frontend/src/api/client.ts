import { getAccessToken } from "../features/auth/lib/auth-token";
import { ApiError } from "./api-error";

const API_URL = import.meta.env.VITE_API_URL;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();

  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(!isFormData && {
        "Content-Type": "application/json",
      }),
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      response.statusText || "An error occurred while processing the request.",
    );
  }

  const responseBody = await response.text();

  if (!responseBody) {
    return undefined as T;
  }

  return JSON.parse(responseBody) as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      ...(body !== undefined && {
        body: JSON.stringify(body),
      }),
    }),

  postFormData: <T>(path: string, body: FormData) =>
    request<T>(path, {
      method: "POST",
      body,
    }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      ...(body !== undefined && {
        body: JSON.stringify(body),
      }),
    }),

  delete: <T>(path: string) =>
    request<T>(path, {
      method: "DELETE",
    }),
};
