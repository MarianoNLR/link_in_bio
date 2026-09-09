const ACCESS_TOKEN_KEY = 'accessToken';
const SESSION_VERSION_KEY = 'authSessionVersion';

export type AuthTokens = { accessToken: string };

export function getSessionVersion() {
  return localStorage.getItem(SESSION_VERSION_KEY);
}

export function setAuthTokens(tokens: AuthTokens) {
  setAccessToken(tokens.accessToken);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  localStorage.setItem(SESSION_VERSION_KEY, crypto.randomUUID());
}

export function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(SESSION_VERSION_KEY);
}
