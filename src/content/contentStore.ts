import i18n from '../i18n';
import en from '../locales/en.json';
import ru from '../locales/ru.json';
import tkm from '../locales/tkm.json';
import type { Lang } from './detectLanguage';

export type Json = string | number | boolean | null | Json[] | { [k: string]: Json };
export type LangContent = Record<string, Json>;
export type AllContent = Record<Lang, LangContent>;

export const LANGS: Lang[] = ['en', 'ru', 'tkm'];
export const LANG_LABELS: Record<Lang, string> = {
  en: 'English',
  ru: 'Русский',
  tkm: 'Türkmen',
};

const STORAGE_KEY = 'dowletli_content_v1';

export const DEFAULT_CONTENT: AllContent = {
  en: en as LangContent,
  ru: ru as LangContent,
  tkm: tkm as LangContent,
};

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

export function loadContent(): AllContent {
  const merged = clone(DEFAULT_CONTENT);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as Partial<AllContent>;
      for (const lang of LANGS) {
        if (stored[lang]) {
          merged[lang] = deepMerge(DEFAULT_CONTENT[lang], stored[lang] as Json) as LangContent;
        }
      }
    }
  } catch {
    /* ignore corrupt storage */
  }
  return merged;
}

export function persistContent(content: AllContent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  } catch {
    /* storage may be full / disabled */
  }
}

export function clearStoredContent() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
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
