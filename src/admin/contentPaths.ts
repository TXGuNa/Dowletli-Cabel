// Helpers for reading / writing values inside the locale JSON tree.

import type { Json, LangContent } from '../content/contentStore';

export type Path = (string | number)[];

export function setByPath(root: LangContent, path: Path, value: Json): LangContent {
  const next = JSON.parse(JSON.stringify(root)) as LangContent;
  let cur = next as unknown as Record<string | number, Json>;
  for (let i = 0; i < path.length - 1; i++) {
    if (cur[path[i]] === undefined || cur[path[i]] === null || typeof cur[path[i]] !== 'object') {
      cur[path[i]] = typeof path[i + 1] === 'number' ? [] : {};
    }
    cur = cur[path[i]] as unknown as Record<string | number, Json>;
  }
  cur[path[path.length - 1]] = value;
  return next;
}

export function getByPath(root: LangContent | undefined, path: Path): Json | undefined {
  let cur: Json | undefined = root as Json | undefined;
  for (const k of path) {
    if (cur && typeof cur === 'object') cur = (cur as Record<string | number, Json>)[k];
    else return undefined;
  }
  return cur;
}

export function getString(root: LangContent | undefined, path: Path): string {
  const v = getByPath(root, path);
  return typeof v === 'string' ? v : '';
}

export function matches(value: Json | undefined, path: Path, q: string): boolean {
  if (!q) return true;
  if (path.join('.').toLowerCase().includes(q)) return true;
  if (typeof value === 'string') return value.toLowerCase().includes(q);
  if (Array.isArray(value)) return value.some((v, i) => matches(v, [...path, i], q));
  if (value && typeof value === 'object') return Object.entries(value).some(([k, v]) => matches(v, [...path, k], q));
  return false;
}

// Keys edited elsewhere in the panel (so they're hidden from the text editor).
export const HIDDEN_KEYS: Record<string, string[]> = {
  products: ['items', 'viewDetails'],
  brand: ['name'],
  footer: ['careers', 'news'],
};

// Nested texts that the site doesn't display (kept in the data, not shown in the editor).
export const HIDDEN_PATHS = new Set(['contact.labels.location', 'contact.badges.global']);

