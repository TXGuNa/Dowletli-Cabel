import i18n from '../i18n';
import en from '../locales/en.json';
import ru from '../locales/ru.json';
import tkm from '../locales/tkm.json';
import type { Lang } from './detectLanguage';
import { readCache, removeCache, writeCache } from './cache';

export type Json = string | number | boolean | null | Json[] | { [k: string]: Json };
export type LangContent = Record<string, Json>;
export type AllContent = Record<Lang, LangContent>;

export const LANGS: Lang[] = ['en', 'ru', 'tkm'];
export const LANG_LABELS: Record<Lang, string> = {
  en: 'English',
  ru: 'Русский',
  tkm: 'Türkmen',
};

export const CONTENT_KEY = 'dowletli_content_v1';
export const CONTENT_EVENT = 'dowletli-content';

// Deep copies, frozen in spirit: never handed to i18next (which mutates its bundles).
export const DEFAULT_CONTENT: AllContent = JSON.parse(JSON.stringify({ en, ru, tkm }));

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

// Deep-merge: defaults provide the full key set, overrides win where present.
function deepMerge(base: Json, override: Json): Json {
  if (
    base && typeof base === 'object' && !Array.isArray(base) &&
    override && typeof override === 'object' && !Array.isArray(override)
  ) {
    const out: Record<string, Json> = { ...(base as Record<string, Json>) };
    for (const key of Object.keys(base as Record<string, Json>)) {
      if (key in (override as Record<string, Json>)) {
        out[key] = deepMerge((base as Record<string, Json>)[key], (override as Record<string, Json>)[key]);
      }
    }
    return out;
  }
  // For arrays and primitives, take the override when it exists
  return override !== undefined ? override : base;
}

// Fill the full key set from the built-in defaults; stored values win.
export function mergeContent(stored: unknown): AllContent {
  const merged = clone(DEFAULT_CONTENT);
  if (stored && typeof stored === 'object') {
    const s = stored as Partial<AllContent>;
    for (const lang of LANGS) {
      if (s[lang] && typeof s[lang] === 'object') {
        merged[lang] = deepMerge(DEFAULT_CONTENT[lang], s[lang] as Json) as LangContent;
      }
    }
  }
  return merged;
}

export function loadContent(): AllContent {
  try {
    const raw = readCache(CONTENT_KEY);
    if (raw) return mergeContent(JSON.parse(raw));
  } catch {
    /* ignore corrupt storage */
  }
  return clone(DEFAULT_CONTENT);
}

export function persistContent(content: AllContent) {
  writeCache(CONTENT_KEY, JSON.stringify(content));
}

export function clearStoredContent() {
  removeCache(CONTENT_KEY);
}

// Push the content into i18next so every t('...') call reflects edits live.
export function applyToI18n(content: AllContent) {
  for (const lang of LANGS) {
    i18n.addResourceBundle(lang, 'translation', content[lang], true, true);
  }
  // Force re-render of components by re-emitting the current language
  i18n.changeLanguage(i18n.language);
}

export function getDefaults(): AllContent {
  return clone(DEFAULT_CONTENT);
}
