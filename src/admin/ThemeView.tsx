// "Theme & design": pick one of the site themes, fine-tune colors, fonts and
// corners, and see the result in the live preview before publishing.

import { useEffect, useState } from 'react';
import { Check, Moon, Palette, RotateCcw, Sparkles, Type, Eye, X } from 'lucide-react';
import {
  THEMES, FONTS, ensureFontLoaded, resolveTheme, type CornerStyle, type ThemeDef, type ThemeSettings,
} from '../content/themes';
import type { Lang } from '../content/detectLanguage';
import { Card, ColorField, FieldLabel, Pill, Segmented } from './ui';
import { PreviewPane } from './preview';
import { PREVIEW_ROUTES } from './pages';
import type { Draft, Tr, Updater } from './types';
import { useMedia } from './useMedia';

function ThemeCard({
  theme, selected, onSelect, brand, uiLang, tr,
}: { theme: ThemeDef; selected: boolean; onSelect: () => void; brand: string; uiLang: Lang; tr: Tr }) {
  const p = theme.palette;
  const r = (base: number) => `${base * theme.radius}px`;
  return (
    <button
      type="button"
      onClick={onSelect}
      data-testid={`theme-${theme.id}`}
      aria-pressed={selected}
      className={`group text-left rounded-2xl border-2 bg-white overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg ${
        selected ? 'border-brand-primary shadow-lg ring-4 ring-brand-primary/10' : 'border-brand-border'
      }`}
    >
      {/* Mini mock of the site in this theme */}
      <div className="relative h-36 overflow-hidden" style={{ background: p.bg, fontFamily: `'${theme.fontBody}', Inter, sans-serif` }}>
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background: `radial-gradient(60% 70% at 15% 10%, ${p.primary}33 0%, transparent 60%), radial-gradient(50% 60% at 90% 20%, ${p.cyan}33 0%, transparent 60%)`,
          }}
        />
        <div className="relative flex items-center justify-between px-3 pt-2.5">
          <span className="text-[9px] font-extrabold tracking-tight" style={{ color: p.ink, fontFamily: `'${theme.fontHeading}', Inter, sans-serif` }}>
            {brand.slice(0, 16)}
          </span>
          <span className="flex gap-1.5">
            {[0, 1, 2].map((i) => <span key={i} className="w-4 h-1 rounded-full" style={{ background: p.slate, opacity: 0.6 }} />)}
          </span>
        </div>
        <div className="relative px-3 pt-3">
          <div className="text-[19px] leading-[1.05] font-extrabold" style={{ color: p.ink, fontFamily: `'${theme.fontHeading}', Inter, sans-serif` }}>
            Optic <span style={{ backgroundImage: `linear-gradient(90deg, ${p.primary}, ${p.blue}, ${p.cyan})`, WebkitBackgroundClip: 'text', color: 'transparent' }}>Cable</span>
          </div>
          <div className="mt-1 text-[9px]" style={{ color: p.text }}>Ýokary hilli · Высокое качество</div>
          <div className="mt-2.5 flex gap-1.5">
            <span
              className="px-2.5 py-1 text-[8px] font-bold"
              style={{ background: `linear-gradient(90deg, ${p.primary}, ${p.cyan})`, color: p.onPrimary, borderRadius: theme.buttonRadius }}
            >
              Products
            </span>
            <span
              className="px-2.5 py-1 text-[8px] font-bold border"
              style={{ background: theme.dark ? `${p.glass}cc` : '#ffffffaa', color: p.ink, borderColor: p.border, borderRadius: theme.buttonRadius }}
            >
              Contact
            </span>
          </div>
        </div>
        <div className="absolute right-3 bottom-3 w-16 h-11 border" style={{ borderRadius: r(10), background: theme.dark ? p.surface : '#ffffffcc', borderColor: p.border }}>
          <div className="m-1.5 h-1.5 w-8 rounded-full" style={{ background: p.ink, opacity: 0.8 }} />
          <div className="mx-1.5 h-1 w-10 rounded-full" style={{ background: p.slate, opacity: 0.5 }} />
          <div className="mx-1.5 mt-1 h-1 w-6 rounded-full" style={{ background: p.primary }} />
        </div>
        {selected && (
          <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center shadow">
            <Check size={14} />
          </span>
        )}
      </div>
      <div className="px-3.5 py-3 border-t border-brand-border">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-bold text-sm text-brand-ink">{theme.name}</span>
          {theme.id === 'classic' && <Pill tone="blue">{tr('defaultBadge')}</Pill>}
          {theme.dark && <Pill tone="dark"><Moon size={10} /> {tr('darkBadge')}</Pill>}
        </div>
        <p className="text-xs text-brand-slate mt-1 leading-snug line-clamp-2">{theme.description[uiLang] || theme.description.en}</p>
        <div className="flex items-center gap-1 mt-2.5">
          {[p.primary, p.blue, p.cyan, p.ink, p.bg].map((c, i) => (
            <span key={i} className="w-4 h-4 rounded-full border border-black/10" style={{ background: c }} />
          ))}
          <span className="ml-auto text-[10px] text-brand-slate truncate max-w-[55%]">{theme.fontHeading}{theme.fontBody !== theme.fontHeading ? ` + ${theme.fontBody}` : ''}</span>
        </div>
      </div>
    </button>
  );
}

export default function ThemeView({
  draft, update, lang, uiLang, tr,
}: { draft: Draft; update: Updater; lang: Lang; uiLang: Lang; tr: Tr }) {
  const theme = draft.settings.theme;
  const resolved = resolveTheme(theme);
  const [route, setRoute] = useState('/');
  const [mobilePreview, setMobilePreview] = useState(false);
  const wide = useMedia('(min-width: 1280px)');

  // Load every theme font so the cards and font menus render in the real faces.
  useEffect(() => {
    for (const t of THEMES) { ensureFontLoaded(t.fontHeading); ensureFontLoaded(t.fontBody); }
    for (const f of FONTS) ensureFontLoaded(f.family);
  }, []);

  const setTheme = (fn: (t: ThemeSettings) => ThemeSettings) =>
    update((d) => ({ ...d, settings: { ...d.settings, theme: fn(d.settings.theme) } }));

  const hasCustom = !!(theme.primary || theme.accent || theme.fontHeading || theme.fontBody || theme.corners);
  const routes = PREVIEW_ROUTES.map((r) => ({ path: r.path, label: tr(r.label) }));

  const fontSelect = (value: string | undefined, fallback: string, onChange: (v: string | undefined) => void, testId: string) => (
    <select
      value={value || ''}
      data-testid={testId}
      onChange={(e) => onChange(e.target.value || undefined)}
      className="w-full bg-white border border-brand-border rounded-xl px-3 py-2.5 text-[15px] text-brand-ink focus:outline-none focus:border-brand-primary"
      style={{ fontFamily: `'${value || fallback}', Inter, sans-serif` }}
    >
      <option value="">{tr('cornersTheme')} — {fallback}</option>
      {FONTS.map((f) => (
        <option key={f.family} value={f.family} style={{ fontFamily: `'${f.family}'` }}>{f.family}</option>
      ))}
    </select>
  );

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-start">
      <div className="grid gap-5 min-w-0">
        <div className="grid sm:grid-cols-2 2xl:grid-cols-3 gap-4" data-testid="theme-grid">
          {THEMES.map((t) => (
            <ThemeCard
              key={t.id}
              theme={t}
              brand={draft.settings.brandName}
              selected={theme.id === t.id}
              onSelect={() => setTheme((cur) => ({ ...cur, id: t.id }))}
              uiLang={uiLang}
              tr={tr}
            />
          ))}
        </div>

        <Card
          title={tr('customize')}
          subtitle={tr('customizeHint')}
          icon={<Sparkles size={17} />}
          actions={
            <button
              type="button"
              disabled={!hasCustom}
              onClick={() => setTheme((t) => ({ id: t.id }))}
              data-testid="reset-custom"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-brand-border text-brand-text hover:text-brand-ink disabled:opacity-40"
            >
              <RotateCcw size={13} /> {tr('resetCustom')}
            </button>
          }
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <ColorField
              label={<span className="inline-flex items-center gap-1.5"><Palette size={14} /> {tr('primaryColor')}</span>}
              value={theme.primary}
              fallback={resolved.def.palette.primary}
              onChange={(hex) => setTheme((t) => ({ ...t, primary: hex }))}
              onReset={() => setTheme((t) => ({ ...t, primary: undefined }))}
              resetLabel={tr('cornersTheme')}
              testId="color-primary"
            />
            <ColorField
              label={<span className="inline-flex items-center gap-1.5"><Palette size={14} /> {tr('accentColor')}</span>}
              value={theme.accent}
              fallback={resolved.def.palette.cyan}
              onChange={(hex) => setTheme((t) => ({ ...t, accent: hex }))}
              onReset={() => setTheme((t) => ({ ...t, accent: undefined }))}
              resetLabel={tr('cornersTheme')}
              testId="color-accent"
            />
            <div>
              <FieldLabel><span className="inline-flex items-center gap-1.5"><Type size={14} /> {tr('headingFont')}</span></FieldLabel>
              {fontSelect(theme.fontHeading, resolved.def.fontHeading, (v) => setTheme((t) => ({ ...t, fontHeading: v })), 'font-heading')}
            </div>
            <div>
              <FieldLabel><span className="inline-flex items-center gap-1.5"><Type size={14} /> {tr('bodyFont')}</span></FieldLabel>
              {fontSelect(theme.fontBody, resolved.def.fontBody, (v) => setTheme((t) => ({ ...t, fontBody: v })), 'font-body')}
            </div>
            <div className="sm:col-span-2">
              <FieldLabel>{tr('corners')}</FieldLabel>
              <Segmented<CornerStyle>
                value={theme.corners || 'theme'}
                onChange={(v) => setTheme((t) => ({ ...t, corners: v === 'theme' ? undefined : v }))}
                options={[
                  { value: 'theme', label: tr('cornersTheme') },
                  { value: 'sharp', label: tr('cornersSharp') },
                  { value: 'soft', label: tr('cornersSoft') },
                  { value: 'round', label: tr('cornersRound') },
                ]}
              />
            </div>
          </div>
          <p className="text-xs text-brand-slate mt-4">{tr('fontsNote')}</p>
        </Card>

        <button
          type="button"
          onClick={() => setMobilePreview(true)}
          className="xl:hidden inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border bg-white text-brand-ink border-brand-border"
        >
          <Eye size={16} /> {tr('openPreview')}
        </button>
      </div>

      {wide && (
        <div className="sticky top-[84px] h-[calc(100vh-108px)]">
          <PreviewPane route={route} lang={lang} draft={draft} tr={tr} routes={routes} onRouteChange={setRoute} className="h-full" />
        </div>
      )}

      {mobilePreview && (
        <div className="fixed inset-0 z-[60] bg-brand-ink/60 p-2 sm:p-6 flex flex-col">
          <button
            type="button"
            onClick={() => setMobilePreview(false)}
            className="self-end mb-2 inline-flex items-center gap-1.5 bg-white rounded-xl px-3 py-2 text-sm font-semibold"
          >
            <X size={15} /> {tr('close')}
          </button>
          <PreviewPane route={route} lang={lang} draft={draft} tr={tr} routes={routes} onRouteChange={setRoute} className="flex-1" />
        </div>
      )}
    </div>
  );
}
