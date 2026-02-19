const API_BASE = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? '' : 'http://localhost:5000');

function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

export async function api(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || res.statusText);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export function setAuthToken(token, remember) {
  if (remember) {
    localStorage.setItem('token', token);
  } else {
    sessionStorage.setItem('token', token);
  }
}

export function clearAuthToken() {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
}

export const AUTH = {
  register: (body) => api('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => api('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => api('/api/auth/me'),
  checkEmail: (email) => fetch(`${API_BASE}/api/auth/check/email?email=${encodeURIComponent(email)}`).then((r) => r.json()),
  checkUsername: (username) => fetch(`${API_BASE}/api/auth/check/username?username=${encodeURIComponent(username)}`).then((r) => r.json()),
};

export const MOVIES = {
  trending: (page = 1) => api(`/api/movies/trending?page=${page}`),
  list: (params) => api(`/api/movies/list?${new URLSearchParams(params)}`),
  search: (q, page = 1) => api(`/api/movies/search?q=${encodeURIComponent(q)}&page=${page}`),
  byId: (id) => api(`/api/movies/${id}`),
};
