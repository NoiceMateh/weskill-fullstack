const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/v1";

const ACCESS_TOKEN_KEY = "accessToken";
const USER_KEY = "user";
const AUTH_EVENT = "weskill-auth-change";

let refreshPromise = null;

const hasWindow = typeof window !== "undefined";

const emitAuthChange = () => {
  if (!hasWindow) return;
  window.dispatchEvent(new Event(AUTH_EVENT));
};

const readStorage = (key) => {
  if (!hasWindow) return null;
  return window.localStorage.getItem(key);
};

const writeStorage = (key, value) => {
  if (!hasWindow) return;

  if (value == null) {
    window.localStorage.removeItem(key);
    return;
  }

  window.localStorage.setItem(key, value);
};

const normalizeSessionUser = (user) => {
  if (!user) return null;

  return {
    ...user,
    name: [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.email,
    isLoggedIn: true,
  };
};

export const getAccessToken = () => readStorage(ACCESS_TOKEN_KEY);

export const getSessionUser = () => {
  const raw = readStorage(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setAccessToken = (token, { silent = false } = {}) => {
  writeStorage(ACCESS_TOKEN_KEY, token || null);
  if (!silent) emitAuthChange();
};

export const setSessionUser = (user, { silent = false } = {}) => {
  const normalized = normalizeSessionUser(user);
  writeStorage(USER_KEY, normalized ? JSON.stringify(normalized) : null);
  if (!silent) emitAuthChange();
  return normalized;
};

export const clearSession = ({ silent = false } = {}) => {
  writeStorage(USER_KEY, null);
  writeStorage(ACCESS_TOKEN_KEY, null);
  if (!silent) emitAuthChange();
};

export const onAuthChange = (callback) => {
  if (!hasWindow) return () => {};

  window.addEventListener(AUTH_EVENT, callback);
  return () => window.removeEventListener(AUTH_EVENT, callback);
};

const getErrorMessage = (payload, fallback) => {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  if (payload.message) return payload.message;

  if (Array.isArray(payload.errors) && payload.errors.length) {
    return payload.errors[0]?.message || payload.errors[0] || fallback;
  }

  return fallback;
};

const isFormData = (value) => typeof FormData !== "undefined" && value instanceof FormData;

const buildHeaders = (options, token) => {
  const headers = {
    ...(options.headers || {}),
  };

  if (!isFormData(options.body) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (options.auth !== false && token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const parseResponse = async (response) => {
  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  try {
    return await response.text();
  } catch {
    return null;
  }
};

const performRequest = async (path, options = {}, token = getAccessToken()) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(options, token),
    credentials: "include",
  });

  const payload = await parseResponse(response);
  return { response, payload };
};

export async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const { response, payload } = await performRequest(
        "/auth/refresh",
        {
          method: "POST",
          auth: false,
        },
        null
      );

      if (!response.ok) {
        clearSession();
        throw new Error(getErrorMessage(payload, "Phiên đăng nhập đã hết hạn"));
      }

      const accessToken = payload?.data?.accessToken;
      const user = payload?.data?.user;

      setAccessToken(accessToken || null, { silent: true });
      setSessionUser(user || null, { silent: true });
      emitAuthChange();

      return payload;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

export async function apiRequest(path, options = {}) {
  const { retryOnAuthError = true, auth = true, ...requestOptions } = options;

  let { response, payload } = await performRequest(path, { ...requestOptions, auth });

  if (response.status === 401 && auth && retryOnAuthError) {
    try {
      await refreshAccessToken();
      ({ response, payload } = await performRequest(path, { ...requestOptions, auth }));
    } catch (error) {
      throw new Error(error.message || "Phiên đăng nhập đã hết hạn");
    }
  }

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, "Yêu cầu không thành công"));
  }

  return payload;
}
