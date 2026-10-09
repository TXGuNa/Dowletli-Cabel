// Local cache for the published site data.
//
// The source of truth is the server (/api/site, stored in Cloudflare KV). This
// cache keeps the last published copy in memory + localStorage so pages render
// instantly and still work if the API is briefly unreachable. If localStorage
// is unavailable (private mode, blocked storage) the in-memory copy still works
// for the current page load.

const memory = new Map<string, string>();

// The admin panel's live-preview iframe (?preview=1) shows UNSAVED drafts. It
// must never write them into localStorage, which it shares with the admin tab.
export const IS_PREVIEW = (() => {
  try {
    // Also true after the admin clicks a link inside the preview (the SPA
    // navigates without ?preview, but it is still the framed preview).
    return new URLSearchParams(window.location.search).has('preview') || window.self !== window.top;
  } catch {
    return true; // cross-origin frame access error => we are framed
  }
})();

export function readCache(key: string): string | null {
  if (memory.has(key)) return memory.get(key) ?? null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeCache(key: string, value: string): void {
  memory.set(key, value);
  if (IS_PREVIEW) return;
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage full / disabled — the in-memory copy is enough for this visit */
  }
}

export function removeCache(key: string): void {
  memory.delete(key);
  if (IS_PREVIEW) return;
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}
