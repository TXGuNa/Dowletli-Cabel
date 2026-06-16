// Site-wide image settings the admin can pick from the gallery (or upload):
// the homepage main banner and the About page photo.

export interface SiteSettings {
  brandName: string;
  heroImage: string;
  aboutImage: string;
}

const KEY = 'dowletli_settings_v1';
export const SETTINGS_EVENT = 'dowletli-settings';

export const DEFAULT_SETTINGS: SiteSettings = {
  brandName: 'DÖWLETLI CABLE',
  heroImage: '/assets/hero-bg.png',
  aboutImage: '/assets/about-us-new.jpg',
};

export function loadSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const data = JSON.parse(raw) as Partial<SiteSettings>;
    return {
      brandName: data.brandName || DEFAULT_SETTINGS.brandName,
      heroImage: data.heroImage || DEFAULT_SETTINGS.heroImage,
      aboutImage: data.aboutImage || DEFAULT_SETTINGS.aboutImage,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function persistSettings(s: SiteSettings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
    window.dispatchEvent(new CustomEvent(SETTINGS_EVENT));
  } catch {
    /* ignore */
  }
}
