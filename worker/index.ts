// Cloudflare Worker for dowletli.net
//
// - Serves the built Vite SPA from ./dist (static assets binding ASSETS).
// - Adds a small JSON API under /api/* backed by Cloudflare KV (binding SITE):
//     GET    /api/site                 published site content (public)
//     PUT    /api/site                 publish content (admin)
//     POST   /api/login                admin sign-in -> session token
//     GET    /api/me                   check the session
//     POST   /api/account              change admin username/password (admin)
//     POST   /api/upload               upload an image (admin) -> /api/img/<id>
//     GET    /api/img/<id>             serve an uploaded image (public)
//     POST   /api/submissions          contact / booking form (public)
//     GET    /api/submissions          list form submissions (admin)
//     PATCH  /api/submissions/<id>     mark read / unread (admin)
//     DELETE /api/submissions/<id>     delete one (admin)
//     DELETE /api/submissions          delete all (admin)
//
// Secrets / vars (Cloudflare dashboard -> Worker -> Settings -> Variables and Secrets):
//   ADMIN_PASSWORD  (secret, required)  first admin password
//   ADMIN_USERNAME  (var, optional)     first admin username (default "admin")
// Once the password is changed from the admin panel, the new one is stored
// (PBKDF2-hashed) in KV and takes over from ADMIN_PASSWORD.

// ---- Minimal platform types (kept local so no extra dependency is needed) ----

interface KVListResult {
  keys: { name: string }[];
  list_complete: boolean;
  cursor?: string;
}

interface KV {
  get(key: string, options?: { type?: 'text'; cacheTtl?: number }): Promise<string | null>;
  getWithMetadata<M>(
    key: string,
    options: { type: 'arrayBuffer'; cacheTtl?: number },
  ): Promise<{ value: ArrayBuffer | null; metadata: M | null }>;
  put(key: string, value: string | ArrayBuffer, options?: { metadata?: unknown }): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<KVListResult>;
}

interface Env {
  SITE?: KV;
  ASSETS: { fetch(request: Request): Promise<Response> };
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD?: string;
}

// ---- Constants ---------------------------------------------------------------

const SITE_KEY = 'site';
const SITE_PREV_KEY = 'site:prev';
const CREDS_KEY = 'auth:creds';
const SIGNING_KEY = 'auth:signing-key';
const SUB_PREFIX = 'sub:';
const IMG_PREFIX = 'img:';

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_SITE_BYTES = 20 * 1024 * 1024;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const PBKDF2_ITERATIONS = 100_000; // Workers' maximum

const IMAGE_TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
};

// ---- Small helpers -------------------------------------------------------------

function json(data: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...extra,
    },
  });
}

const err = (status: number, error: string, extra: Record<string, unknown> = {}) =>
  json({ error, ...extra }, status);

const enc = new TextEncoder();

function toHex(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let out = '';
  for (const b of bytes) out += b.toString(16).padStart(2, '0');
  return out;
}

function fromHex(hex: string): Uint8Array<ArrayBuffer> {
  const out = new Uint8Array(new ArrayBuffer(hex.length / 2));
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

function b64url(bytes: Uint8Array): string {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(str: string): Uint8Array<ArrayBuffer> {
  const s = str.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(s + '='.repeat((4 - (s.length % 4)) % 4));
  const out = new Uint8Array(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function randomHex(bytes: number): string {
  return toHex(crypto.getRandomValues(new Uint8Array(bytes)));
}

async function sha256Hex(input: string): Promise<string> {
  return toHex(await crypto.subtle.digest('SHA-256', enc.encode(input)));
}

// Constant-time string comparison (both inputs are hashes of equal length).
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function pbkdf2Hex(password: string, saltHex: string, iterations: number): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: fromHex(saltHex), iterations },
    key,
    256,
  );
  return toHex(bits);
}

async function readJson<T>(request: Request, maxBytes: number): Promise<T | null> {
  const len = Number(request.headers.get('content-length') || '0');
  if (len > maxBytes) return null;
  const text = await request.text();
  if (text.length > maxBytes) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function clientIp(request: Request): string {
  return request.headers.get('cf-connecting-ip') || 'unknown';
}

// ---- Tiny best-effort rate limiter (per colo, via the Cache API) --------------

function edgeCache(): Cache | null {
  try {
    return (caches as unknown as { default: Cache }).default;
  } catch {
    return null;
  }
}

async function hitCount(bucket: string, ip: string): Promise<number> {
  const cache = edgeCache();
  if (!cache) return 0;
  const res = await cache.match(`https://ratelimit.internal/${bucket}/${encodeURIComponent(ip)}`);
  return res ? Number(await res.text()) || 0 : 0;
}

async function addHit(bucket: string, ip: string, windowSec: number): Promise<void> {
  const cache = edgeCache();
  if (!cache) return;
  const n = (await hitCount(bucket, ip)) + 1;
  await cache.put(
    `https://ratelimit.internal/${bucket}/${encodeURIComponent(ip)}`,
    new Response(String(n), { headers: { 'cache-control': `max-age=${windowSec}` } }),
  );
}

// ---- Admin credentials & sessions ---------------------------------------------

interface StoredCreds {
  username: string;
  salt: string;
  hash: string;
  iterations: number;
}

interface ActiveCreds {
  username: string;
  // Changes whenever the password changes -> old sessions stop working.
  version: string;
  verify(password: string): Promise<boolean>;
}

async function activeCreds(env: Env, kv: KV): Promise<ActiveCreds | null> {
  const raw = await kv.get(CREDS_KEY);
  if (raw) {
    try {
      const c = JSON.parse(raw) as StoredCreds;
      if (c.username && c.salt && c.hash) {
        return {
          username: c.username,
          version: c.hash.slice(0, 16),
          verify: async (pw) => safeEqual(await pbkdf2Hex(pw, c.salt, c.iterations || PBKDF2_ITERATIONS), c.hash),
        };
      }
    } catch {
      /* fall through to env */
    }
  }
  const envPw = env.ADMIN_PASSWORD;
  if (!envPw) return null; // not configured -> nobody can sign in
  const envHash = await sha256Hex(`env::${envPw}`);
  return {
    username: (env.ADMIN_USERNAME || 'admin').trim(),
    version: envHash.slice(0, 16),
    verify: async (pw) => safeEqual(await sha256Hex(`env::${pw}`), envHash),
  };
}

async function signingKey(kv: KV): Promise<CryptoKey> {
  let hex = await kv.get(SIGNING_KEY);
  if (!hex) {
    hex = randomHex(32);
    await kv.put(SIGNING_KEY, hex);
  }
  return crypto.subtle.importKey('raw', fromHex(hex), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

interface SessionPayload {
  u: string;
  v: string;
  exp: number;
}

async function makeToken(kv: KV, creds: ActiveCreds): Promise<{ token: string; expiresAt: number }> {
  const payload: SessionPayload = { u: creds.username, v: creds.version, exp: Date.now() + SESSION_TTL_MS };
  const body = b64url(enc.encode(JSON.stringify(payload)));
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', await signingKey(kv), enc.encode(body)));
  return { token: `${body}.${b64url(sig)}`, expiresAt: payload.exp };
}

async function requireAdmin(request: Request, env: Env, kv: KV): Promise<SessionPayload | null> {
  const auth = request.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  try {
    const ok = await crypto.subtle.verify('HMAC', await signingKey(kv), b64urlDecode(sig), enc.encode(body));
    if (!ok) return null;
    const payload = JSON.parse(new TextDecoder().decode(b64urlDecode(body))) as SessionPayload;
    if (!payload.exp || payload.exp < Date.now()) return null;
    const creds = await activeCreds(env, kv);
    if (!creds || creds.version !== payload.v) return null;
    return payload;
  } catch {
    return null;
  }
}

// ---- Site content --------------------------------------------------------------

interface SiteDoc {
  updatedAt: number;
  content: Record<string, unknown>;
  products: unknown[];
  gallery: unknown[];
  settings: Record<string, unknown>;
}

function isObj(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

async function getSite(kv: KV): Promise<Response> {
  const raw = await kv.get(SITE_KEY);
  if (!raw) return new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
  return new Response(raw, {
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

async function putSite(request: Request, kv: KV): Promise<Response> {
  const body = await readJson<Partial<SiteDoc> & { baseUpdatedAt?: number; force?: boolean }>(request, MAX_SITE_BYTES);
  if (!body) return err(400, 'invalid_body');
  const { content, products, gallery, settings } = body;
  if (!isObj(content) || !isObj(content.en) || !isObj(content.ru) || !isObj(content.tkm)) {
    return err(400, 'invalid_content');
  }
  if (!Array.isArray(products) || !Array.isArray(gallery) || !isObj(settings)) return err(400, 'invalid_body');

  const currentRaw = await kv.get(SITE_KEY);
  let currentUpdatedAt = 0;
  if (currentRaw) {
    try {
      currentUpdatedAt = (JSON.parse(currentRaw) as SiteDoc).updatedAt || 0;
    } catch {
      /* ignore */
    }
  }
  // Someone else published since this admin loaded the panel -> ask first.
  if (!body.force && currentRaw && (body.baseUpdatedAt || 0) !== currentUpdatedAt) {
    return err(409, 'conflict', { updatedAt: currentUpdatedAt });
  }

  const doc: SiteDoc = {
    updatedAt: Math.max(Date.now(), currentUpdatedAt + 1),
    content,
    products,
    gallery,
    settings,
  };
  if (currentRaw) await kv.put(SITE_PREV_KEY, currentRaw); // one-step backup
  await kv.put(SITE_KEY, JSON.stringify(doc));
  return json({ ok: true, updatedAt: doc.updatedAt });
}

// ---- Images ----------------------------------------------------------------------

async function uploadImage(request: Request, kv: KV): Promise<Response> {
  const type = (request.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
  const ext = IMAGE_TYPES[type];
  if (!ext) return err(415, 'unsupported_type');
  const len = Number(request.headers.get('content-length') || '0');
  if (len > MAX_IMAGE_BYTES) return err(413, 'too_large');
  const buf = await request.arrayBuffer();
  if (buf.byteLength === 0) return err(400, 'empty');
  if (buf.byteLength > MAX_IMAGE_BYTES) return err(413, 'too_large');
  const id = `${Date.now().toString(36)}${randomHex(8)}.${ext}`;
  await kv.put(IMG_PREFIX + id, buf, { metadata: { type, size: buf.byteLength } });
  return json({ ok: true, url: `/api/img/${id}` });
}

async function serveImage(id: string, kv: KV): Promise<Response> {
  if (!/^[a-z0-9]+\.[a-z]+$/.test(id)) return new Response('Not found', { status: 404 });
  const { value, metadata } = await kv.getWithMetadata<{ type?: string }>(IMG_PREFIX + id, {
    type: 'arrayBuffer',
    cacheTtl: 86400, // ids are unique, so the bytes never change
  });
  if (!value) return new Response('Not found', { status: 404 });
  return new Response(value, {
    headers: {
      'content-type': metadata?.type || 'application/octet-stream',
      'cache-control': 'public, max-age=31536000, immutable',
      'x-content-type-options': 'nosniff',
      // An uploaded SVG opened directly must not be able to run scripts.
      'content-security-policy': "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox",
    },
  });
}

// ---- Form submissions ------------------------------------------------------------

interface Submission {
  id: string;
  type: 'contact' | 'booking';
  name: string;
  email: string;
  message?: string;
  service?: string;
  date?: string;
  time?: string;
  createdAt: number;
  read: boolean;
}

function str(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

async function addSubmission(request: Request, kv: KV): Promise<Response> {
  const ip = clientIp(request);
  if ((await hitCount('submit', ip)) >= 5) return err(429, 'too_many_requests');

  const body = await readJson<Record<string, unknown>>(request, 32 * 1024);
  if (!body) return err(400, 'invalid_body');
  const type = body.type === 'booking' ? 'booking' : body.type === 'contact' ? 'contact' : null;
  if (!type) return err(400, 'invalid_type');

  const now = Date.now();
  // Inverted timestamp -> KV's lexicographic listing returns newest first.
  const id = `${String(9_999_999_999_999 - now).padStart(13, '0')}-${randomHex(4)}`;
  const sub: Submission = {
    id,
    type,
    name: str(body.name, 200),
    email: str(body.email, 200),
    createdAt: now,
    read: false,
  };
  if (type === 'contact') {
    sub.message = str(body.message, 5000);
    if (!sub.email && !sub.message) return err(400, 'empty');
  } else {
    sub.service = str(body.service, 100);
    sub.date = str(body.date, 40);
    sub.time = str(body.time, 40);
    if (!sub.email && !sub.name) return err(400, 'empty');
  }
  await kv.put(SUB_PREFIX + id, JSON.stringify(sub));
  await addHit('submit', ip, 600); // max 5 submissions per IP per ~10 minutes
  return json({ ok: true });
}

async function listSubmissionKeys(kv: KV, max = 1000): Promise<string[]> {
  const names: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await kv.list({ prefix: SUB_PREFIX, cursor, limit: 1000 });
    for (const k of page.keys) names.push(k.name);
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor && names.length < max);
  return names.slice(0, max);
}

async function listSubmissions(kv: KV): Promise<Response> {
  const names = await listSubmissionKeys(kv, 500);
  const items: Submission[] = [];
  for (let i = 0; i < names.length; i += 50) {
    const batch = await Promise.all(names.slice(i, i + 50).map((n) => kv.get(n)));
    for (const raw of batch) {
      if (!raw) continue;
      try {
        items.push(JSON.parse(raw) as Submission);
      } catch {
        /* skip corrupt entry */
      }
    }
  }
  items.sort((a, b) => b.createdAt - a.createdAt);
  return json({ items });
}

async function patchSubmission(request: Request, kv: KV, id: string): Promise<Response> {
  const body = await readJson<{ read?: boolean }>(request, 1024);
  if (!body || typeof body.read !== 'boolean') return err(400, 'invalid_body');
  const raw = await kv.get(SUB_PREFIX + id);
  if (!raw) return err(404, 'not_found');
  const sub = JSON.parse(raw) as Submission;
  sub.read = body.read;
  await kv.put(SUB_PREFIX + id, JSON.stringify(sub));
  return json({ ok: true });
}

// ---- Router ------------------------------------------------------------------------

async function handleApi(request: Request, env: Env, url: URL): Promise<Response> {
  const kv = env.SITE;
  const path = url.pathname.replace(/\/+$/, '');
  const method = request.method.toUpperCase();

  if (path === '/api/health') {
    return json({ ok: true, kv: !!kv, adminConfigured: !!env.ADMIN_PASSWORD });
  }
  if (!kv) return err(503, 'kv_not_bound');

  // Public endpoints
  if (path === '/api/site' && method === 'GET') return getSite(kv);
  if (path.startsWith('/api/img/') && (method === 'GET' || method === 'HEAD')) {
    return serveImage(path.slice('/api/img/'.length), kv);
  }
  if (path === '/api/submissions' && method === 'POST') return addSubmission(request, kv);

  if (path === '/api/login' && method === 'POST') {
    const ip = clientIp(request);
    if ((await hitCount('login', ip)) >= 8) return err(429, 'too_many_attempts');
    const body = await readJson<{ username?: string; password?: string }>(request, 4096);
    if (!body) return err(400, 'invalid_body');
    const creds = await activeCreds(env, kv);
    if (!creds) return err(503, 'admin_not_configured');
    const userOk = (body.username || '').trim().toLowerCase() === creds.username.toLowerCase();
    const passOk = await creds.verify(body.password || '');
    if (!userOk || !passOk) {
      await addHit('login', ip, 900); // 8 failures -> wait ~15 minutes
      return err(401, 'invalid_credentials');
    }
    const { token, expiresAt } = await makeToken(kv, creds);
    return json({ token, expiresAt, username: creds.username });
  }

  // Everything below needs a valid admin session — unknown paths are a plain 404.
  const ADMIN_ROUTE = /^\/api\/(me|site|upload|account|submissions(\/[0-9a-f-]+)?)$/;
  if (!ADMIN_ROUTE.test(path)) return err(404, 'not_found');
  const session = await requireAdmin(request, env, kv);
  if (!session) return err(401, 'unauthorized');

  if (path === '/api/me' && method === 'GET') return json({ username: session.u });
  if (path === '/api/site' && method === 'PUT') return putSite(request, kv);
  if (path === '/api/upload' && method === 'POST') return uploadImage(request, kv);

  if (path === '/api/account' && method === 'POST') {
    const body = await readJson<{ username?: string; password?: string }>(request, 4096);
    const username = (body?.username || '').trim();
    const password = body?.password || '';
    if (!username || username.length > 64 || password.length < 8 || password.length > 200) {
      return err(400, 'invalid_credentials_format');
    }
    const salt = randomHex(16);
    const stored: StoredCreds = {
      username,
      salt,
      hash: await pbkdf2Hex(password, salt, PBKDF2_ITERATIONS),
      iterations: PBKDF2_ITERATIONS,
    };
    await kv.put(CREDS_KEY, JSON.stringify(stored));
    const creds = await activeCreds(env, kv);
    if (!creds) return err(500, 'server_error');
    const { token, expiresAt } = await makeToken(kv, creds); // old sessions are now invalid
    return json({ ok: true, token, expiresAt, username });
  }

  if (path === '/api/submissions' && method === 'GET') return listSubmissions(kv);
  if (path === '/api/submissions' && method === 'DELETE') {
    const names = await listSubmissionKeys(kv);
    await Promise.all(names.map((n) => kv.delete(n)));
    return json({ ok: true, deleted: names.length });
  }
  const subMatch = path.match(/^\/api\/submissions\/([0-9a-f-]+)$/);
  if (subMatch) {
    if (method === 'PATCH') return patchSubmission(request, kv, subMatch[1]);
    if (method === 'DELETE') {
      await kv.delete(SUB_PREFIX + subMatch[1]);
      return json({ ok: true });
    }
  }

  return err(404, 'not_found');
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    try {
      return await handleApi(request, env, url);
    } catch (e) {
      console.error('API error', e);
      return err(500, 'server_error');
    }
  },
};
