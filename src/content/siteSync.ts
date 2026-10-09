// Keeps the browser's cached copy of the site in sync with the published
// version on the server (/api/site).
//
// On every page load main.tsx waits (briefly) for bootstrapSite() before the
// first render, so visitors see the latest published texts/images without a
// flash of old content. The request itself is started even earlier by a tiny
// inline script in index.html (window.__DOWLETLI_SITE__).

import { fetchSite, type SiteDoc } from './api';
import { readCache, writeCache } from './cache';
import { CONTENT_EVENT, CONTENT_KEY } from './contentStore';
import { PRODUCTS_EVENT, PRODUCTS_KEY } from './productsStore';
import { GALLERY_EVENT, GALLERY_KEY } from './galleryStore';
import { SETTINGS_EVENT, SETTINGS_KEY } from './settingsStore';

const REV_KEY = 'dowletli_site_rev';

declare global {
  interface Window {
    __DOWLETLI_SITE__?: Promise<unknown>;
  }
}

export function getCachedRev(): number {
  return Number(readCache(REV_KEY)) || 0;
}

export function setCachedRev(rev: number) {
  writeCache(REV_KEY, String(rev));
}

// Write a published document into the local cache. Returns false when the cache
// already holds a newer version (e.g. a slightly stale edge read right after Save).
export function applySiteToCache(doc: SiteDoc, notify = false): boolean {
  if (doc.updatedAt < getCachedRev()) return false;
  writeCache(CONTENT_KEY, JSON.stringify(doc.content));
  writeCache(PRODUCTS_KEY, JSON.stringify(doc.products));
  writeCache(GALLERY_KEY, JSON.stringify(doc.gallery));
  writeCache(SETTINGS_KEY, JSON.stringify(doc.settings));
  setCachedRev(doc.updatedAt);
  if (notify) {
    for (const ev of [CONTENT_EVENT, PRODUCTS_EVENT, GALLERY_EVENT, SETTINGS_EVENT]) {
      window.dispatchEvent(new CustomEvent(ev));
    }
  }
  return true;
}

function isDoc(v: unknown): v is SiteDoc {
  const d = v as SiteDoc | null;
  return !!d && typeof d === 'object' && typeof d.updatedAt === 'number' && !!d.content;
}

// Wait up to `timeoutMs` for the published site; render with the cache/defaults
// if the API is slow, and apply the data live once it arrives.
export async function bootstrapSite(timeoutMs = 2500): Promise<void> {
  const pending: Promise<unknown> = (window.__DOWLETLI_SITE__ ?? fetchSite()).catch(() => null);
  let rendered = false;
  const timeout = new Promise<'timeout'>((resolve) => setTimeout(() => resolve('timeout'), timeoutMs));
  const first = await Promise.race([pending, timeout]);
  if (first === 'timeout') {
    rendered = true;
    pending.then((doc) => {
      if (isDoc(doc)) applySiteToCache(doc, rendered);
    });
    return;
  }
  if (isDoc(first)) applySiteToCache(first);
}
