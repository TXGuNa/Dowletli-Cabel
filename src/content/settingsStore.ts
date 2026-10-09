// Site-wide settings (not per language): brand name, logo and page images,
// social links, theme, which sections are shown, booking time slots.
// Published via the admin panel; cached locally.

import { readCache, writeCache } from './cache';
import { type ThemeSettings, DEFAULT_THEME_SETTINGS, normalizeThemeSettings } from './themes';

export interface SocialLink {
  id: string;
  platform: string; // instagram | linkedin | whatsapp | youtube | imo | telegram | facebook | twitter | email | phone | website
  url: string;
}

// Sections the admin can show / hide.
export const SECTION_KEYS = [
  'headerBook',        // "Book consultation" button in the header
  'heroStats',         // 3 stat boxes under the hero image
  'homeFeatures',      // feature cards
  'homeManufacturing', // manufacturing block with photo
  'homeCta',           // blue call-to-action banner
  'footerAdminLink',   // small "Admin" link in the footer
] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];
export type SectionToggles = Record<SectionKey, boolean>;

export interface SiteSettings {
  brandName: string;
  logoImage: string;
  heroImage: string;
  homeImage: string;
  aboutImage: string;
  socials: SocialLink[];
  theme: ThemeSettings;
  sections: SectionToggles;
  bookingTimes: string[];
  bookingDays: number;
}

export const SETTINGS_KEY = 'dowletli_settings_v1';
export const SETTINGS_EVENT = 'dowletli-settings';

const ALL_ON = Object.fromEntries(SECTION_KEYS.map((k) => [k, true])) as SectionToggles;

export const DEFAULT_SETTINGS: SiteSettings = {
  brandName: 'DÖWLETLI CABLE',
  logoImage: '/assets/logo.png',
  heroImage: '/assets/hero-bg.png',
  homeImage: '/assets/factory-interior-new.jpg',
  aboutImage: '/assets/about-us-new.jpg',
  socials: [
    { id: 's-ig', platform: 'instagram', url: '' },
    { id: 's-in', platform: 'linkedin', url: '' },
    { id: 's-wa', platform: 'whatsapp', url: '' },
  ],
  theme: DEFAULT_THEME_SETTINGS,
  sections: ALL_ON,
  bookingTimes: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
  bookingDays: 6,
};

export function makeSocialLink(): SocialLink {
  return { id: `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`, platform: 'instagram', url: '' };
}

export function defaultSettings(): SiteSettings {
  return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
}

export function normalizeSettings(raw: unknown): SiteSettings {
  const def = defaultSettings();
  if (!raw || typeof raw !== 'object') return def;
  const data = raw as Partial<SiteSettings>;
  const str = (v: unknown, fallback: string) => (typeof v === 'string' && v ? v : fallback);
  const sections = { ...ALL_ON };
  if (data.sections && typeof data.sections === 'object') {
    for (const k of SECTION_KEYS) {
      if (typeof data.sections[k] === 'boolean') sections[k] = data.sections[k];
    }
  }
  const times = Array.isArray(data.bookingTimes)
    ? data.bookingTimes.filter((t): t is string => typeof t === 'string')
    : def.bookingTimes;
  const days = Number(data.bookingDays);
  return {
    brandName: str(data.brandName, def.brandName),
    logoImage: str(data.logoImage, def.logoImage),
    heroImage: str(data.heroImage, def.heroImage),
    homeImage: str(data.homeImage, def.homeImage),
    aboutImage: str(data.aboutImage, def.aboutImage),
    socials: Array.isArray(data.socials)
      ? data.socials
          .filter((s) => s && typeof s.url === 'string')
          .map((s) => ({ id: s.id || `s-${Math.random().toString(36).slice(2, 6)}`, platform: s.platform || 'website', url: s.url }))
      : def.socials,
    theme: normalizeThemeSettings(data.theme),
    sections,
    bookingTimes: times,
    bookingDays: Number.isFinite(days) && days >= 1 && days <= 30 ? Math.round(days) : def.bookingDays,
  };
}

export function loadSettings(): SiteSettings {
  try {
    const raw = readCache(SETTINGS_KEY);
    return raw ? normalizeSettings(JSON.parse(raw)) : defaultSettings();
  } catch {
    return defaultSettings();
  }
}

export function persistSettings(s: SiteSettings) {
  writeCache(SETTINGS_KEY, JSON.stringify(s));
  window.dispatchEvent(new CustomEvent(SETTINGS_EVENT));
}
