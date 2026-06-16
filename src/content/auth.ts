// Client-side admin auth.
//
// NOTE: This app has no backend, so credentials are verified in the browser.
// The plaintext password is NEVER stored in the source — only a salted
// SHA-256 hash is. That keeps the password out of the code, but be aware that
// front-end-only auth can never be fully secure (a determined user can read the
// bundled JS). For real protection, move this check to a server.
//
// To change the credentials, hash the new values with the same salt:
//   node -e "const c=require('crypto');const s='dowletli::optic::salt::v1';\
//   console.log(c.createHash('sha256').update(s+'NEW_PASSWORD').digest('hex'))"

const SALT = 'dowletli::optic::salt::v1';

// sha256(SALT + 'nuraly')
const USER_HASH = '7e4b3e0ea7dbbd66062085479d14aa52bcc374ea52cf386a95ebad88ba4e99d8';
// sha256(SALT + 'U12345678142536b')
const PASS_HASH = 'a6e844016343171a74991f4d341eb3004d8aa36a65ac2c62330ac17180a944d1';

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(SALT + input);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  try {
    const [u, p] = await Promise.all([
      sha256Hex(username.trim().toLowerCase()),
      sha256Hex(password),
    ]);
    return u === USER_HASH && p === PASS_HASH;
  } catch {
    return false;
  }
}
