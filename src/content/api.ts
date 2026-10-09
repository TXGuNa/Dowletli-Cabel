// Thin client for the Worker API (worker/index.ts).

const TOKEN_KEY = 'dowletli_admin_token';
const USER_KEY = 'dowletli_admin_user';

export class ApiError extends Error {
  status: number;
  code: string;
  data: Record<string, unknown>;
  constructor(status: number, code: string, data: Record<string, unknown> = {}) {
    super(code);
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

// ---- Admin session -----------------------------------------------------------

export function getToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getAdminUsername(): string {
  try {
    return sessionStorage.getItem(USER_KEY) || '';
  } catch {
    return '';
  }
}

function setSession(token: string, username: string) {
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, username);
  } catch {
    /* ignore */
  }
}

export function clearSession() {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
}

// ---- Core request helper -----------------------------------------------------

async function request<T>(
  path: string,
  init: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.auth) {
    const token = getToken();
    if (token) headers.set('authorization', `Bearer ${token}`);
  }
  let res: Response;
  try {
    res = await fetch(path, { ...init, headers, cache: 'no-store' });
  } catch {
    throw new ApiError(0, 'network_error');
  }
  if (res.status === 204) return null as T;
  let data: Record<string, unknown> = {};
  try {
    data = await res.json();
  } catch {
    /* non-JSON body (e.g. the SPA's index.html when no Worker is running) */
    if (res.ok) throw new ApiError(res.status, 'api_unavailable');
  }
  if (!res.ok) throw new ApiError(res.status, String(data.error || 'http_error'), data);
  return data as T;
}

const jsonInit = (method: string, body: unknown, auth = true): RequestInit & { auth?: boolean } => ({
  method,
  auth,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body),
});

// ---- Auth --------------------------------------------------------------------

export async function login(username: string, password: string): Promise<void> {
  const r = await request<{ token: string; username: string }>('/api/login', jsonInit('POST', { username, password }, false));
  setSession(r.token, r.username);
}

export async function changeAccount(username: string, password: string): Promise<void> {
  const r = await request<{ token: string; username: string }>('/api/account', jsonInit('POST', { username, password }));
  setSession(r.token, r.username);
}

// ---- Site content ------------------------------------------------------------

export interface SiteDoc {
  updatedAt: number;
  content: unknown;
  products: unknown;
  gallery: unknown;
  settings: unknown;
}

export function isSiteDoc(v: unknown): v is SiteDoc {
  const d = v as SiteDoc | null;
  return !!d && typeof d === 'object' && typeof d.updatedAt === 'number' && !!d.content;
}

// null = nothing has been published to the server yet.
export async function fetchSite(): Promise<SiteDoc | null> {
  const data = await request<unknown>('/api/site');
  if (data === null) return null;
  if (!isSiteDoc(data)) throw new ApiError(200, 'invalid_site');
  return data;
}

export async function publishSite(
  doc: Omit<SiteDoc, 'updatedAt'>,
  baseUpdatedAt: number,
  force = false,
): Promise<number> {
  const r = await request<{ updatedAt: number }>('/api/site', jsonInit('PUT', { ...doc, baseUpdatedAt, force }));
  return r.updatedAt;
}

export async function uploadImage(blob: Blob): Promise<string> {
  const r = await request<{ url: string }>('/api/upload', {
    method: 'POST',
    auth: true,
    headers: { 'content-type': blob.type || 'application/octet-stream' },
    body: blob,
  });
  return r.url;
}

// ---- Form submissions --------------------------------------------------------

export async function sendSubmission(body: Record<string, string>): Promise<void> {
  await request('/api/submissions', jsonInit('POST', body, false));
}

export async function fetchSubmissions<T>(): Promise<T[]> {
  const r = await request<{ items: T[] }>('/api/submissions', { auth: true });
  return r.items || [];
}

export async function setSubmissionRead(id: string, read: boolean): Promise<void> {
  await request(`/api/submissions/${encodeURIComponent(id)}`, jsonInit('PATCH', { read }));
}

export async function removeSubmission(id: string): Promise<void> {
  await request(`/api/submissions/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true });
}

export async function removeAllSubmissions(): Promise<void> {
  await request('/api/submissions', { method: 'DELETE', auth: true });
}
