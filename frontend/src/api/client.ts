import {
  getAccessToken,
  getSessionVersion,
  setAuthTokens,
  removeAccessToken,
} from "../features/auth/lib/auth-token";
import type { AuthTokens } from "../features/auth/lib/auth-token";
import { ApiError } from "./api-error";

const API_URL = import.meta.env.VITE_API_URL;
const AUTH_ENDPOINTS = new Set([
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
]);
let refreshPromise: Promise<void> | null = null;

function expireSession() {
  removeAccessToken();
  window.location.replace("/");
}

async function refreshSession(previousVersion: string | null): Promise<void> {
  console.log("Refreshing session...");
  if (refreshPromise) return refreshPromise;

  const rotate = async () => {
    const version = getSessionVersion();
    // Another request (or tab) may already have rotated these credentials.
    if (version && version !== previousVersion) return;
    if (!getAccessToken()) {
      expireSession();
      throw new ApiError(401, "Session expired");
    }

    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok)
        throw new ApiError(response.status, "Session refresh failed");
      const tokens = (await response.json()) as AuthTokens;
      if (typeof tokens.accessToken !== "string" || !tokens.accessToken) {
        throw new ApiError(502, "Invalid refresh response");
      }
      // Do not restore a session that was cleared or replaced while awaiting fetch.
      if (getSessionVersion() !== version) {
        throw new ApiError(401, "Session changed");
      }
      setAuthTokens(tokens);
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.status === 401 &&
        getSessionVersion() === version
      ) {
        expireSession();
      }

      throw error;
    }
  };

  // Web Locks also serialize rotation across tabs sharing localStorage.
  refreshPromise = (
    navigator.locks ? navigator.locks.request("auth-refresh", rotate) : rotate()
  ).finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  retried = false,
): Promise<T> {
  const canRefresh = !AUTH_ENDPOINTS.has(
    path.split("?")[0].replace(/\/+$/, ""),
  );
  if (canRefresh && refreshPromise) await refreshPromise;
  const token = getAccessToken();
  const version = getSessionVersion();

  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
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

  if (response.status === 401 && canRefresh && token) {
    if (!retried) {
      await refreshSession(version);
      return request<T>(path, options, true);
    }
    if (getAccessToken() === token && getSessionVersion() === version)
      expireSession();
  }

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

export async function logoutSession(): Promise<void> {
  // Finish any rotation before sending the cookie that revokes the session.
  if (refreshPromise) await refreshPromise.catch(() => undefined);
  const logout = async () => {
    await request<void>("/auth/logout", { method: "POST" });
    removeAccessToken();
  };
  if (navigator.locks) await navigator.locks.request("auth-refresh", logout);
  else await logout();
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
