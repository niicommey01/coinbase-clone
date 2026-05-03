const TOKEN_KEY = 'crypto_app_token';

export function getApiBase() {
  const base = import.meta.env.VITE_API_URL;
  return (typeof base === 'string' && base.length > 0 ? base : 'http://localhost:5000').replace(/\/$/, '');
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

/**
 * JSON fetch to the backend. Sends Bearer token from localStorage and cookies (credentials).
 */
export async function apiFetch(path, options = {}) {
  const { body, headers: initHeaders, ...rest } = options;
  const headers = new Headers(initHeaders ?? {});

  const token = getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let reqBody = body;
  if (body !== undefined && body !== null && typeof body === 'object' && !(body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
    reqBody = JSON.stringify(body);
  }

  const res = await fetch(`${getApiBase()}${path}`, {
    ...rest,
    headers,
    body: reqBody,
    credentials: 'include',
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text || 'Invalid response' };
  }

  if (!res.ok) {
    const message =
      (data && typeof data === 'object' && data.message) ||
      `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
