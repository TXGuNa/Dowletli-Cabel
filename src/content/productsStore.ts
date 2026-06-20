// Editable product catalog — lets the admin add/remove products and their
// images. Seeded from the locale JSON the first time, then stored in the
// browser (localStorage). Read by the public Products page and the admin panel.

import en from '../locales/en.json';
import ru from '../locales/ru.json';
import tkm from '../locales/tkm.json';
import { LANGS } from './contentStore';
import type { Lang } from './detectLanguage';

export interface ProductText {
  title: string;
  description: string;
  specs: string[];
}

export interface Product {
  id: string;
  image: string;            // URL or data URL ('' = no image)
  category: string;         // category key (translated if known) or free text
  t: Record<Lang, ProductText>;
}

const KEY = 'dowletli_products_v1';
export const PRODUCTS_EVENT = 'dowletli-products';

// Built-in category keys (translated in the locale files under products.categories).
// The admin can also type brand-new category names; those are stored as-is.
export const DEFAULT_CATEGORIES = ['aerial', 'underground', 'ftth', 'directBurial'] as const;

// Original 5 products with their images + category keys
const SEED: { key: string; category: string; image: string }[] = [
  { key: 'selfSupporting', category: 'aerial', image: '/assets/product-self-supporting.png' },
  { key: 'armoredDuct', category: 'underground', image: '/assets/product-armored-duct.png' },
  { key: 'flatDrop', category: 'ftth', image: '/assets/product-flat-drop.png' },
  { key: 'figure8', category: 'aerial', image: '/assets/product-figure8.png' },
  { key: 'armoredSoil', category: 'directBurial', image: '/assets/product-armored-soil.png' },
];

type Locale = typeof en;

function pick(locale: Locale, key: string): ProductText {
  const items = (locale as unknown as { products: { items: Record<string, ProductText> } }).products.items;
  const it = items[key] || { title: '', description: '', specs: [] };
  return { title: it.title || '', description: it.description || '', specs: [...(it.specs || [])] };
}

export function defaultProducts(): Product[] {
  const locales: Record<Lang, Locale> = { en, ru: ru as Locale, tkm: tkm as Locale };
  return SEED.map((s) => ({
    id: s.key,
    image: s.image,
    category: s.category,
    t: {
      en: pick(locales.en, s.key),
      ru: pick(locales.ru, s.key),
      tkm: pick(locales.tkm, s.key),
    },
  }));
}

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

export function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultProducts();
    const data = JSON.parse(raw) as Product[];
    if (!Array.isArray(data) || data.length === 0) return defaultProducts();
    // Make sure every language bucket exists
    return data.map((p) => {
      const t = { ...p.t } as Record<Lang, ProductText>;
      for (const l of LANGS) {
        if (!t[l]) t[l] = { title: '', description: '', specs: [] };
        if (!Array.isArray(t[l].specs)) t[l].specs = [];
      }
      return { ...p, image: p.image || '', category: p.category || '', t };
    });
  } catch {
    return defaultProducts();
  }
}

export function persistProducts(list: Product[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(PRODUCTS_EVENT));
  } catch {
    /* storage may be full (large images) */
  }
}

export function clearProducts() {
  try {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new CustomEvent(PRODUCTS_EVENT));
  } catch {
    /* ignore */
  }
}

export function makeEmptyProduct(): Product {
  const empty: ProductText = { title: '', description: '', specs: [] };
  return {
    id: `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    image: '',
    category: '',
    t: { en: clone(empty), ru: clone(empty), tkm: clone(empty) },
  };
}
