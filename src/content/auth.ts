// Client-side admin auth.
//
// NOTE: This app has no backend, so credentials are verified in the browser.
// The plaintext password is NEVER stored — only a salted SHA-256 hash is (in the
// source as a default, and in localStorage once the admin changes it). Username
// is not secret, so it is kept in plaintext for display. Front-end-only auth can
// never be fully secure; for real protection move this check to a server.

const SALT = 'dowletli::optic::salt::v1';

// Defaults (used until the admin changes them in the panel)
const DEFAULT_USERNAME = 'nuraly';
// sha256(SALT + 'nuraly')
const DEFAULT_USER_HASH = '7e4b3e0ea7dbbd66062085479d14aa52bcc374ea52cf386a95ebad88ba4e99d8';
// sha256(SALT + 'U12345678142536b')
const DEFAULT_PASS_HASH = 'a6e844016343171a74991f4d341eb3004d8aa36a65ac2c62330ac17180a944d1';

const CRED_KEY = 'dowletli_admin_cred_v1';

interface Creds {
  username: string;
  userHash: string;
  passHash: string;
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(SALT + input);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function loadCreds(): Creds {
  try {
    const raw = localStorage.getItem(CRED_KEY);
    if (raw) {
      const c = JSON.parse(raw) as Partial<Creds>;
      if (c.userHash && c.passHash) {
        return { username: c.username || DEFAULT_USERNAME, userHash: c.userHash, passHash: c.passHash };
      }
    }
  } catch {
    /* ignore */
  }
  return { username: DEFAULT_USERNAME, userHash: DEFAULT_USER_HASH, passHash: DEFAULT_PASS_HASH };
}

export function getAdminUsername(): string {
  return loadCreds().username;
}

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  try {
    const [u, p] = await Promise.all([
      sha256Hex(username.trim().toLowerCase()),
      sha256Hex(password),
    ]);
    const creds = loadCreds();
    return u === creds.userHash && p === creds.passHash;
  } catch {
    return false;
  }
}

// Update the admin login. Returns false on invalid input.
export async function changeCredentials(newUsername: string, newPassword: string): Promise<boolean> {
  const username = newUsername.trim();
  if (username.length < 1 || newPassword.length < 6) return false;
  try {
    const [userHash, passHash] = await Promise.all([
      sha256Hex(username.toLowerCase()),
      sha256Hex(newPassword),
    ]);
    localStorage.setItem(CRED_KEY, JSON.stringify({ username, userHash, passHash }));
    return true;
  } catch {
    return false;
  }
}
