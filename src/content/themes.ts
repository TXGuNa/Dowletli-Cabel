import { IS_PREVIEW } from './cache';

// Site themes. A theme is a set of CSS variables (colors, fonts, corner radius)
// that the whole public site reads through Tailwind's `brand-*` colors.
// "classic" is the original Döwletli look and the default.
//
// Every font here supports Latin-Extended (Türkmen: ä ç ň ö ş ü ý ž) AND
// Cyrillic (Russian), so all three site languages render correctly.

export interface ThemePalette {
  bg: string;        // page background
  surface: string;   // solid cards, menus
  soft: string;      // tinted fills / hovers
  primary: string;   // main brand color (buttons, links)
  blue: string;      // secondary (middle of gradients)
  cyan: string;      // accent (end of gradients)
  teal: string;      // second accent
  ink: string;       // headings
  text: string;      // body text
  slate: string;     // muted text
  border: string;    // hairlines
  onPrimary: string; // text on primary buttons
  overlay: string;   // dark overlays (lightbox, image fades)
  shadow: string;    // shadow tint
  glass: string;     // frosted-glass fill
  glassBorder: string;
}

export interface ThemeDef {
  id: string;
  name: string;
  description: { en: string; ru: string; tkm: string };
  dark: boolean;
  palette: ThemePalette;
  fontHeading: string;
  fontBody: string;
  radius: number;      // multiplier for card corners (1 = original)
  buttonRadius: string; // CSS length for buttons / pills
  glassAlpha: number;
  glassBorderAlpha: number;
}

export interface FontDef {
  family: string;
  weights: string; // Google Fonts css2 weights that exist for this family
  kind: 'sans' | 'serif' | 'display';
}

export const FONTS: FontDef[] = [
  { family: 'Inter', weights: '400;500;600;700;800;900', kind: 'sans' },
  { family: 'Manrope', weights: '400;500;600;700;800', kind: 'sans' },
  { family: 'Montserrat', weights: '400;500;600;700;800;900', kind: 'sans' },
  { family: 'IBM Plex Sans', weights: '400;500;600;700', kind: 'sans' },
  { family: 'Rubik', weights: '400;500;600;700;800;900', kind: 'sans' },
  { family: 'Nunito', weights: '400;500;600;700;800;900', kind: 'sans' },
  { family: 'Raleway', weights: '400;500;600;700;800;900', kind: 'sans' },
  { family: 'Jost', weights: '400;500;600;700;800;900', kind: 'sans' },
  { family: 'Onest', weights: '400;500;600;700;800;900', kind: 'sans' },
  { family: 'Golos Text', weights: '400;500;600;700;800;900', kind: 'sans' },
  { family: 'Exo 2', weights: '400;500;600;700;800;900', kind: 'sans' },
  { family: 'Unbounded', weights: '400;500;600;700;800;900', kind: 'display' },
  { family: 'Oswald', weights: '400;500;600;700', kind: 'display' },
  { family: 'Playfair Display', weights: '400;500;600;700;800;900', kind: 'serif' },
  { family: 'Lora', weights: '400;500;600;700', kind: 'serif' },
  { family: 'PT Serif', weights: '400;700', kind: 'serif' },
];

const LIGHT_GLASS = { glass: '#FFFFFF', glassBorder: '#FFFFFF' };

export const THEMES: ThemeDef[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: {
      en: 'The original Döwletli look — airy glass, blue → cyan.',
      ru: 'Оригинальный стиль Döwletli — светлое стекло, синий → бирюзовый.',
      tkm: 'Asyl Döwletli görnüşi — açyk aýna, gök → mawy.',
    },
    dark: false,
    palette: {
      bg: '#F3F7FF', surface: '#FFFFFF', soft: '#E9F1FF',
      primary: '#2563EB', blue: '#3B82F6', cyan: '#06B6D4', teal: '#14B8A6',
      ink: '#0E1626', text: '#41506B', slate: '#7587A3', border: '#E2EAF7',
      onPrimary: '#FFFFFF', overlay: '#0E1626', shadow: '#0E1626', ...LIGHT_GLASS,
    },
    fontHeading: 'Inter', fontBody: 'Inter',
    radius: 1, buttonRadius: '9999px', glassAlpha: 0.6, glassBorderAlpha: 0.7,
  },
  {
    id: 'midnight',
    name: 'Midnight Fiber',
    description: {
      en: 'Dark navy with glowing neon-blue fiber accents.',
      ru: 'Тёмно-синий фон с неоновыми акцентами оптоволокна.',
      tkm: 'Neon-gök optika öwüşgünli garaňky fon.',
    },
    dark: true,
    palette: {
      bg: '#070D1A', surface: '#0F1A2E', soft: '#14233F',
      primary: '#3171F0', blue: '#60A5FA', cyan: '#22D3EE', teal: '#2DD4BF',
      ink: '#F1F5FF', text: '#B4C2DC', slate: '#7D8DAA', border: '#1E2C47',
      onPrimary: '#FFFFFF', overlay: '#000000', shadow: '#000000',
      glass: '#13203A', glassBorder: '#FFFFFF',
    },
    fontHeading: 'Manrope', fontBody: 'Manrope',
    radius: 1, buttonRadius: '9999px', glassAlpha: 0.6, glassBorderAlpha: 0.08,
  },
  {
    id: 'emerald',
    name: 'Emerald',
    description: {
      en: 'Turkmen green with a warm gold accent.',
      ru: 'Туркменский зелёный с тёплым золотым акцентом.',
      tkm: 'Türkmen ýaşyl reňki we ýyly altyn öwüşgin.',
    },
    dark: false,
    palette: {
      bg: '#F2FAF5', surface: '#FFFFFF', soft: '#E3F4EA',
      primary: '#00843D', blue: '#16A34A', cyan: '#C8A24A', teal: '#0F766E',
      ink: '#0B2117', text: '#3E5A4B', slate: '#6F8A7C', border: '#D9EDE1',
      onPrimary: '#FFFFFF', overlay: '#0B2117', shadow: '#0B2117', ...LIGHT_GLASS,
    },
    fontHeading: 'Montserrat', fontBody: 'Montserrat',
    radius: 1, buttonRadius: '9999px', glassAlpha: 0.65, glassBorderAlpha: 0.75,
  },
  {
    id: 'karakum',
    name: 'Karakum Sand',
    description: {
      en: 'Warm desert sand, terracotta and elegant serif headings.',
      ru: 'Тёплый песок пустыни, терракота и элегантные заголовки.',
      tkm: 'Ýyly çöl çägesi, terrakota we nepis sözbaşylar.',
    },
    dark: false,
    palette: {
      bg: '#FBF6EE', surface: '#FFFDF9', soft: '#F5EADB',
      primary: '#B45309', blue: '#D97706', cyan: '#C2410C', teal: '#A16207',
      ink: '#2B1D0E', text: '#5E4B37', slate: '#9A8670', border: '#EEDFCB',
      onPrimary: '#FFFFFF', overlay: '#2B1D0E', shadow: '#2B1D0E',
      glass: '#FFFDF9', glassBorder: '#FFFFFF',
    },
    fontHeading: 'Playfair Display', fontBody: 'Manrope',
    radius: 0.75, buttonRadius: '9999px', glassAlpha: 0.7, glassBorderAlpha: 0.8,
  },
  {
    id: 'graphite',
    name: 'Graphite Industrial',
    description: {
      en: 'Neutral steel greys, safety-orange accents, sharp corners.',
      ru: 'Стальные серые тона, оранжевые акценты, острые углы.',
      tkm: 'Polat çal reňkler, mämişi öwüşgin, ýiti burçlar.',
    },
    dark: false,
    palette: {
      bg: '#F4F4F5', surface: '#FFFFFF', soft: '#EBEBED',
      primary: '#C2410C', blue: '#EA580C', cyan: '#F59E0B', teal: '#FB923C',
      ink: '#18181B', text: '#3F3F46', slate: '#71717A', border: '#E4E4E7',
      onPrimary: '#FFFFFF', overlay: '#18181B', shadow: '#18181B', ...LIGHT_GLASS,
    },
    fontHeading: 'Oswald', fontBody: 'IBM Plex Sans',
    radius: 0.3, buttonRadius: '6px', glassAlpha: 0.8, glassBorderAlpha: 0.9,
  },
  {
    id: 'royal',
    name: 'Royal Violet',
    description: {
      en: 'Deep violet to pink gradients on soft lavender.',
      ru: 'Фиолетово-розовые градиенты на лавандовом фоне.',
      tkm: 'Ýumşak lawanda fonda gyrmyzy-gülgüne geçişler.',
    },
    dark: false,
    palette: {
      bg: '#F7F5FF', surface: '#FFFFFF', soft: '#EFEAFF',
      primary: '#6D28D9', blue: '#8B5CF6', cyan: '#EC4899', teal: '#A855F7',
      ink: '#1E1240', text: '#4B4370', slate: '#8A82A8', border: '#E7E1FA',
      onPrimary: '#FFFFFF', overlay: '#1E1240', shadow: '#1E1240', ...LIGHT_GLASS,
    },
    fontHeading: 'Raleway', fontBody: 'Nunito',
    radius: 1.15, buttonRadius: '9999px', glassAlpha: 0.6, glassBorderAlpha: 0.7,
  },
  {
    id: 'crimson',
    name: 'Crimson Steel',
    description: {
      en: 'Bold red with cool steel tones — strong and corporate.',
      ru: 'Насыщенный красный и холодная сталь — строго и солидно.',
      tkm: 'Gyzyl we sowuk polat reňkleri — berk we resmi.',
    },
    dark: false,
    palette: {
      bg: '#F7F7F8', surface: '#FFFFFF', soft: '#FBEAEA',
      primary: '#B91C1C', blue: '#DC2626', cyan: '#475569', teal: '#64748B',
      ink: '#111827', text: '#374151', slate: '#6B7280', border: '#E5E7EB',
      onPrimary: '#FFFFFF', overlay: '#111827', shadow: '#111827', ...LIGHT_GLASS,
    },
    fontHeading: 'Rubik', fontBody: 'Rubik',
    radius: 0.6, buttonRadius: '10px', glassAlpha: 0.75, glassBorderAlpha: 0.85,
  },
  {
    id: 'ocean',
    name: 'Ocean Teal',
    description: {
      en: 'Fresh teal and sky blue on a cool mint background.',
      ru: 'Свежий бирюзовый и небесно-голубой на мятном фоне.',
      tkm: 'Salkyn nane fonda täze mawy we asman gögi.',
    },
    dark: false,
    palette: {
      bg: '#F0FBFB', surface: '#FFFFFF', soft: '#DDF5F4',
      primary: '#0F766E', blue: '#0D9488', cyan: '#0EA5E9', teal: '#22D3EE',
      ink: '#062A2E', text: '#335A5E', slate: '#6B9196', border: '#D3EEEC',
      onPrimary: '#FFFFFF', overlay: '#062A2E', shadow: '#062A2E', ...LIGHT_GLASS,
    },
    fontHeading: 'Onest', fontBody: 'Onest',
    radius: 1.25, buttonRadius: '9999px', glassAlpha: 0.6, glassBorderAlpha: 0.7,
  },
  {
    id: 'carbon',
    name: 'Carbon Gold',
    description: {
      en: 'Luxury dark: carbon black with gold details.',
      ru: 'Премиальный тёмный: чёрный карбон и золото.',
      tkm: 'Premium garaňky: gara karbon we altyn.',
    },
    dark: true,
    palette: {
      bg: '#0B0B0C', surface: '#161618', soft: '#1F1F22',
      primary: '#D4A64A', blue: '#E6C27A', cyan: '#B8862F', teal: '#F2D48F',
      ink: '#F7F3EA', text: '#C9C2B3', slate: '#8C8678', border: '#2A2A2E',
      onPrimary: '#141414', overlay: '#000000', shadow: '#000000',
      glass: '#1A1A1D', glassBorder: '#FFFFFF',
    },
    fontHeading: 'Playfair Display', fontBody: 'Inter',
    radius: 0.5, buttonRadius: '9999px', glassAlpha: 0.65, glassBorderAlpha: 0.07,
  },
  {
    id: 'arctic',
    name: 'Arctic Minimal',
    description: {
      en: 'Clean white and black, minimal with a blue accent.',
      ru: 'Чистый белый и чёрный, минимализм с синим акцентом.',
      tkm: 'Arassa ak we gara, gök öwüşginli minimalizm.',
    },
    dark: false,
    palette: {
      bg: '#FFFFFF', surface: '#FFFFFF', soft: '#F4F6F8',
      primary: '#111827', blue: '#374151', cyan: '#2563EB', teal: '#0EA5E9',
      ink: '#0A0A0A', text: '#404040', slate: '#8A8A8A', border: '#EAEAEA',
      onPrimary: '#FFFFFF', overlay: '#0A0A0A', shadow: '#0A0A0A',
      glass: '#FFFFFF', glassBorder: '#E5E5E5',
    },
    fontHeading: 'Golos Text', fontBody: 'Golos Text',
    radius: 0.25, buttonRadius: '4px', glassAlpha: 0.9, glassBorderAlpha: 1,
  },
  {
    id: 'sunset',
    name: 'Sunset Energy',
    description: {
      en: 'Energetic coral → orange → amber with bold display type.',
      ru: 'Энергичный коралловый → оранжевый → янтарный.',
      tkm: 'Güýçli merjen → mämişi → kähribar reňkler.',
    },
    dark: false,
    palette: {
      bg: '#FFF7F3', surface: '#FFFFFF', soft: '#FFEDE4',
      primary: '#CF3A40', blue: '#F76B15', cyan: '#F5A524', teal: '#FF8A65',
      ink: '#2A1310', text: '#5C3F38', slate: '#9C7E76', border: '#F7E1D7',
      onPrimary: '#FFFFFF', overlay: '#2A1310', shadow: '#2A1310', ...LIGHT_GLASS,
    },
    fontHeading: 'Unbounded', fontBody: 'Onest',
    radius: 1, buttonRadius: '9999px', glassAlpha: 0.6, glassBorderAlpha: 0.7,
  },
];

export const DEFAULT_THEME_ID = 'classic';

export type CornerStyle = 'theme' | 'sharp' | 'soft' | 'round';

// What the admin saves (inside site settings).
export interface ThemeSettings {
  id: string;
  primary?: string;     // hex override
  accent?: string;      // hex override (gradient end)
  fontHeading?: string;
  fontBody?: string;
  corners?: CornerStyle;
}

export const DEFAULT_THEME_SETTINGS: ThemeSettings = { id: DEFAULT_THEME_ID };

const HEX = /^#[0-9a-fA-F]{6}$/;

export function normalizeThemeSettings(raw: unknown): ThemeSettings {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_THEME_SETTINGS };
  const r = raw as Partial<ThemeSettings>;
  const fontOk = (f?: string) => (f && FONTS.some((x) => x.family === f) ? f : undefined);
  const out: ThemeSettings = { id: THEMES.some((t) => t.id === r.id) ? (r.id as string) : DEFAULT_THEME_ID };
  if (r.primary && HEX.test(r.primary)) out.primary = r.primary;
  if (r.accent && HEX.test(r.accent)) out.accent = r.accent;
  if (fontOk(r.fontHeading)) out.fontHeading = r.fontHeading;
  if (fontOk(r.fontBody)) out.fontBody = r.fontBody;
  if (r.corners && ['sharp', 'soft', 'round'].includes(r.corners)) out.corners = r.corners;
  return out;
}

export function getTheme(id: string): ThemeDef {
  return THEMES.find((t) => t.id === id) || THEMES[0];
}

// ---- Applying a theme -------------------------------------------------------

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

// Pick readable text (white or near-black) for a custom primary color.
function readableOn(hex: string): string {
  const [r, g, b] = hexToRgb(hex).split(' ').map(Number);
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum > 0.62 ? '#141414' : '#FFFFFF';
}

export interface ResolvedTheme {
  def: ThemeDef;
  palette: ThemePalette;
  fontHeading: string;
  fontBody: string;
  radius: number;
  buttonRadius: string;
}

export function resolveTheme(s: ThemeSettings): ResolvedTheme {
  const def = getTheme(s.id);
  const palette = { ...def.palette };
  if (s.primary) {
    palette.primary = s.primary;
    palette.onPrimary = readableOn(s.primary);
  }
  if (s.accent) palette.cyan = s.accent;
  let radius = def.radius;
  let buttonRadius = def.buttonRadius;
  if (s.corners === 'sharp') { radius = 0.25; buttonRadius = '4px'; }
  if (s.corners === 'soft') { radius = 0.7; buttonRadius = '12px'; }
  if (s.corners === 'round') { radius = 1.15; buttonRadius = '9999px'; }
  return {
    def,
    palette,
    fontHeading: s.fontHeading || def.fontHeading,
    fontBody: s.fontBody || def.fontBody,
    radius,
    buttonRadius,
  };
}

const VAR_NAMES: Record<keyof ThemePalette, string> = {
  bg: '--c-bg', surface: '--c-surface', soft: '--c-soft', primary: '--c-primary', blue: '--c-blue',
  cyan: '--c-cyan', teal: '--c-teal', ink: '--c-ink', text: '--c-text', slate: '--c-slate',
  border: '--c-border', onPrimary: '--c-on-primary', overlay: '--c-overlay', shadow: '--c-shadow',
  glass: '--c-glass', glassBorder: '--c-glass-border',
};

export function themeCssVars(t: ResolvedTheme): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [k, name] of Object.entries(VAR_NAMES)) {
    vars[name] = hexToRgb(t.palette[k as keyof ThemePalette]);
  }
  vars['--font-heading'] = `'${t.fontHeading}'`;
  vars['--font-body'] = `'${t.fontBody}'`;
  vars['--radius-scale'] = String(t.radius);
  vars['--radius-btn'] = t.buttonRadius;
  vars['--glass-alpha'] = String(t.def.glassAlpha);
  vars['--glass-border-alpha'] = String(t.def.glassBorderAlpha);
  return vars;
}

// Load a Google Font once (one <link> per family so a failure can't block others).
export function ensureFontLoaded(family: string) {
  if (family === 'Inter') return; // already in index.html
  const def = FONTS.find((f) => f.family === family);
  if (!def) return;
  const id = `gf-${family.replace(/\s+/g, '-').toLowerCase()}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}:wght@${def.weights}&display=swap`;
  document.head.appendChild(link);
}

export function applyTheme(s: ThemeSettings, target: HTMLElement = document.documentElement) {
  const t = resolveTheme(s);
  for (const [k, v] of Object.entries(themeCssVars(t))) target.style.setProperty(k, v);
  target.style.colorScheme = t.def.dark ? 'dark' : 'light';
  target.style.setProperty('--boot-bg', t.palette.bg); // <html> background (overscroll areas)
  target.dataset.theme = t.def.id;
  ensureFontLoaded(t.fontHeading);
  ensureFontLoaded(t.fontBody);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', t.palette.bg);
  rememberBoot({ bg: t.palette.bg, primary: t.palette.primary });
}

// index.html reads this before the app loads, so a dark theme doesn't flash
// light (and the splash shows the uploaded logo) on the next visit.
export const BOOT_KEY = 'dowletli_boot';
export function rememberBoot(patch: Record<string, string>) {
  try {
    if (IS_PREVIEW) return;
    const cur = JSON.parse(localStorage.getItem(BOOT_KEY) || '{}');
    localStorage.setItem(BOOT_KEY, JSON.stringify({ ...cur, ...patch }));
  } catch {
    /* ignore */
  }
}

// Back to the built-in defaults (used for the admin panel itself).
export function clearTheme(target: HTMLElement = document.documentElement) {
  for (const name of [...Object.values(VAR_NAMES), '--font-heading', '--font-body', '--radius-scale', '--radius-btn', '--glass-alpha', '--glass-border-alpha']) {
    target.style.removeProperty(name);
  }
  target.style.colorScheme = '';
  target.style.removeProperty('--boot-bg');
  target.style.removeProperty('--boot-accent');
  delete target.dataset.theme;
}
