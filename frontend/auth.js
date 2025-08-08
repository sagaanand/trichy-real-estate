// auth.js

// Token storage helpers
export function setToken(token) {
  localStorage.setItem('token', token);
}
export function getToken() {
  return localStorage.getItem('token');
}
export function removeToken() {
  localStorage.removeItem('token');
}

// Fetch utility with JSON and auth header
export async function apiFetch(path, opts = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...opts.headers,
    ...(token ? { 'x-auth-token': token } : {})
  };
  const res = await fetch(path, { ...opts, headers });
  if (!res.ok) throw new Error((await res.json()).msg || 'Error');
  return res.json();
}
