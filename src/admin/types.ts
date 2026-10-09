import type { AdminKey } from '../content/adminStrings';
import type { AllContent } from '../content/contentStore';
import type { Product } from '../content/productsStore';
import type { GalleryImage } from '../content/galleryStore';
import type { SiteSettings } from '../content/settingsStore';
import type { Lang } from '../content/detectLanguage';

export type Tr = (k: AdminKey) => string;

// Everything the admin edits. Nothing reaches visitors until it is published.
export interface Draft {
  content: AllContent;
  products: Product[];
  gallery: GalleryImage[];
  settings: SiteSettings;
}

export type Updater = (fn: (d: Draft) => Draft) => void;

export type View = 'dashboard' | 'pages' | 'products' | 'gallery' | 'theme' | 'settings' | 'requests';

export const VIEWS: View[] = ['dashboard', 'pages', 'products', 'gallery', 'theme', 'settings', 'requests'];

export interface ViewProps {
  draft: Draft;
  update: Updater;
  lang: Lang;
  tr: Tr;
}

export function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

// Key-order-independent JSON (undefined dropped) — used to compare drafts.
export function stableStringify(v: unknown): string {
  if (v === null || typeof v !== 'object') return JSON.stringify(v) ?? 'null';
  if (Array.isArray(v)) return `[${v.map((x) => (x === undefined ? 'null' : stableStringify(x))).join(',')}]`;
  const o = v as Record<string, unknown>;
  return `{${Object.keys(o)
    .filter((k) => o[k] !== undefined)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${stableStringify(o[k])}`)
    .join(',')}}`;
}
