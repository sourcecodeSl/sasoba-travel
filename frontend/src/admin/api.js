import { API_BASE } from '../data/content.js';

const KEY = 'sasoba_admin_token';

const storage = {
  get() {
    try {
      return localStorage.getItem(KEY) || sessionStorage.getItem(KEY);
    } catch {
      return null;
    }
  },
  set(token, remember) {
    try {
      (remember ? localStorage : sessionStorage).setItem(KEY, token);
    } catch {
      /* private mode: keep it in memory only */
    }
  },
  clear() {
    try {
      localStorage.removeItem(KEY);
      sessionStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  },
};

let memoryToken = storage.get();
const listeners = new Set();

export const tokenStore = {
  get: () => memoryToken,
  set(token, remember) {
    memoryToken = token;
    storage.set(token, remember);
  },
  clear() {
    memoryToken = null;
    storage.clear();
  },
  /** Called when the server says the session is no longer valid. */
  onExpired(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function api(path, { method = 'GET', body, form } = {}) {
  const headers = {};
  if (memoryToken) headers.Authorization = `Bearer ${memoryToken}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let res;
  try {
    res = await fetch(`${API_BASE}/${path}`, {
      method,
      headers,
      body: form ?? (body !== undefined ? JSON.stringify(body) : undefined),
    });
  } catch {
    throw new ApiError('Can’t reach the server. Is XAMPP (Apache + MySQL) running?', 0);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && memoryToken && !path.startsWith('auth/login')) {
      tokenStore.clear();
      listeners.forEach((fn) => fn());
    }
    // The dev proxy answers 502/504 when Apache isn't running.
    if (!data.error && (res.status === 502 || res.status === 504)) {
      throw new ApiError('Can’t reach the server. Is XAMPP (Apache + MySQL) running?', res.status);
    }
    throw new ApiError(data.error || `Request failed (${res.status})`, res.status);
  }
  return data;
}

export const uploadImage = (file) => {
  const form = new FormData();
  form.append('file', file);
  return api('admin/upload', { method: 'POST', form });
};
