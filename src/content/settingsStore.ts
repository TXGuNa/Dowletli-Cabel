// Site-wide image settings the admin can pick from the gallery (or upload):
// the homepage main banner and the About page photo.

export interface SocialLink {
  id: string;
  platform: string; // instagram | linkedin | whatsapp | youtube | imo | telegram | facebook | twitter | email | phone | website
  url: string;
}

export interface SiteSettings {
  brandName: string;
  heroImage: string;
  aboutImage: string;
  socials: SocialLink[];
}

const KEY = 'dowletli_settings_v1';
export const SETTINGS_EVENT = 'dowletli-settings';

export const DEFAULT_SETTINGS: SiteSettings = {
  brandName: 'DÖWLETLI CABLE',
  heroImage: '/assets/hero-bg.png',
  aboutImage: '/assets/about-us-new.jpg',
  socials: [
    { id: 's-ig', platform: 'instagram', url: '' },
    { id: 's-in', platform: 'linkedin', url: '' },
    { id: 's-wa', platform: 'whatsapp', url: '' },
  ],
};

export function makeSocialLink(): SocialLink {
  return { id: `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`, platform: 'instagram', url: '' };
}

export function loadSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_SETTINGS, socials: DEFAULT_SETTINGS.socials.map((s) => ({ ...s })) };
    const data = JSON.parse(raw) as Partial<SiteSettings>;
    return {
      brandName: data.brandName || DEFAULT_SETTINGS.brandName,
      heroImage: data.heroImage || DEFAULT_SETTINGS.heroImage,
      aboutImage: data.aboutImage || DEFAULT_SETTINGS.aboutImage,
      socials: Array.isArray(data.socials)
        ? data.socials
            .filter((s) => s && typeof s.url === 'string')
            .map((s) => ({ id: s.id || `s-${Math.random().toString(36).slice(2, 6)}`, platform: s.platform || 'website', url: s.url }))
        : DEFAULT_SETTINGS.socials.map((s) => ({ ...s })),
    };
  } catch {
    return { ...DEFAULT_SETTINGS, socials: DEFAULT_SETTINGS.socials.map((s) => ({ ...s })) };
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
