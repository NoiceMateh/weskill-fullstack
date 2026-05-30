import { apiRequest, setAccessToken, setSessionUser, clearSession, getSessionUser } from "../lib/api";

export async function register(payload) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function login(payload) {
  const response = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
    retryOnAuthError: false,
  });

  const accessToken = response?.data?.accessToken;
  const user = response?.data?.user;

  setAccessToken(accessToken || null, { silent: true });
  setSessionUser(user || null);

  return response;
}

export async function logout() {
  try {
    await apiRequest("/auth/logout", { method: "POST" });
  } finally {
    clearSession();
  }
}

export async function fetchCurrentUser() {
  const response = await apiRequest("/auth/me");
  const user = response?.data?.user || null;
  setSessionUser(user || null);
  return user;
}

export async function initializeAuth() {
  try {
    return await fetchCurrentUser();
  } catch {
    clearSession();
    return getSessionUser();
  }
}
