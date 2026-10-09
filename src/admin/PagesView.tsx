// "Pages & texts": every text, image and section switch of the site,
// grouped by the page it appears on, with a live preview next to it.

import { useMemo, useState } from 'react';
import {
  PanelTop, Images, CalendarClock, Search as SearchIcon,
  Globe, FileText, Languages, RotateCcw, Plus, Trash2, Eye, X,
} from 'lucide-react';
import { LANGS, type Json } from '../content/contentStore';
import type { Lang } from '../content/detectLanguage';
import type { AdminKey } from '../content/adminStrings';
import { SOCIAL_PLATFORMS } from '../content/socials';
import SocialIcon from '../components/SocialIcon';
import { DEFAULT_SETTINGS, makeSocialLink, type SectionKey, type SiteSettings } from '../content/settingsStore';
import { NodeEditor, type EditorCtx } from './fields';
import { setByPath, getString, matches, type Path } from './contentPaths';
import { PAGES, PREVIEW_ROUTES } from './pages';
import { Card, FieldLabel, ImagePicker, TextInput, Toggle, inputCls } from './ui';
import { PreviewPane, type Highlight } from './preview';
import type { Draft, Tr, Updater } from './types';
import { useMedia } from './useMedia';

const TIME_RE = /^([01]?\d|2[0-3]):[0-5]\d$/;

// The first whole hour after the latest slot that isn't taken yet.
function nextFreeTime(times: string[]): string {
  const taken = new Set(times.map((t) => t.trim()));
  const hours = times.filter((t) => TIME_RE.test(t.trim())).map((t) => Number(t.trim().split(':')[0]));
  let h = hours.length ? Math.max(...hours) + 1 : 9;
  for (let i = 0; i < 24; i++, h++) {
    const c = `${String(h % 24).padStart(2, '0')}:00`;
    if (!taken.has(c)) return c;
  }
  return '12:30';
}

// Section switches shown on each page.
const PAGE_TOGGLES: Record<string, SectionKey[]> = {
  header: ['headerBook'],
  home: ['heroStats', 'homeFeatures', 'homeManufacturing', 'homeCta'],
  footer: ['footerAdminLink'],
};

type ImageKey = 'logoImage' | 'heroImage' | 'homeImage' | 'aboutImage';
const PAGE_IMAGES: Record<string, { key: ImageKey; label: AdminKey; contain?: boolean; aspect?: string }[]> = {
  header: [{ key: 'logoImage', label: 'logo', contain: true, aspect: 'aspect-square' }],
  home: [
    { key: 'heroImage', label: 'mainBanner', aspect: 'aspect-[16/9]' },
    { key: 'homeImage', label: 'homeImage', aspect: 'aspect-[4/5]' },
  ],
  about: [{ key: 'aboutImage', label: 'aboutImage', aspect: 'aspect-[4/3]' }],
};

export default function PagesView({
  draft, update, lang, uiLang, tr, defaults, pageId, setPageId,
}: {
  draft: Draft;
  update: Updater;
  lang: Lang;
  uiLang: Lang;
  tr: Tr;
  defaults: Draft['content'];
  pageId: string;
  setPageId: (id: string) => void;
}) {
  const [compare, setCompare] = useState(false);
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState<Highlight | null>(null);
  const flash = (text: string) => setHighlight((h) => ({ text, n: (h?.n ?? 0) + 1 }));
  const [previewRoute, setPreviewRoute] = useState<string | null>(null);
  const [mobilePreview, setMobilePreview] = useState(false);
  const wide = useMedia('(min-width: 1280px)');

  // Unknown top-level keys (added later) still get an editor under "Other texts".
  const pages = useMemo(() => {
    const known = new Set(PAGES.flatMap((p) => p.sections));
    const other = Object.keys(draft.content.en).filter((k) => !known.has(k));
    return other.length
      ? [...PAGES, { id: 'other', label: 'pageOther' as AdminKey, icon: FileText, route: '/', sections: other }]
      : PAGES;
  }, [draft.content.en]);

  const searching = query.trim().length > 0;
  const page = pages.find((p) => p.id === pageId) || pages[1];
  const visibleSections = searching ? pages.flatMap((p) => p.sections) : page.sections;
  const route = previewRoute ?? page.route;

  const setSettings = (fn: (s: SiteSettings) => SiteSettings) => update((d) => ({ ...d, settings: fn(d.settings) }));

  const ctx: EditorCtx = {
    langs: compare ? LANGS : [lang],
    uiLang,
    data: draft.content,
    query: query.trim().toLowerCase(),
    tr,
    onChange: (l: Lang, path: Path, value: Json) =>
      update((d) => ({ ...d, content: { ...d.content, [l]: setByPath(d.content[l], path, value) } })),
    onFocusField: (path: Path, value: string, l: Lang) => {
      // Show the page that contains this text, in the language being edited.
      const owner = pages.find((p) => p.sections.includes(String(path[0])));
      if (owner) setPreviewRoute(owner.route);
      if (l === lang) flash(value || getString(draft.content[l], path));
    },
  };

  const resetPage = () => {
    if (!confirm(tr('confirmResetPage'))) return;
    update((d) => {
      const content = { ...d.content };
      for (const l of LANGS) {
        let next = content[l];
        for (const key of page.sections) next = setByPath(next, [key], JSON.parse(JSON.stringify(defaults[l][key])));
        content[l] = next;
      }
      return { ...d, content };
    });
  };

  const toggles = searching ? [] : PAGE_TOGGLES[page.id] || [];
  const images = searching ? [] : PAGE_IMAGES[page.id] || [];
  const routes = PREVIEW_ROUTES.map((r) => ({ path: r.path, label: tr(r.label) }));

  const editor = (
    <div className="grid gap-4 min-w-0">
      {/* Page-specific settings */}
      {!searching && page.id === 'header' && (
        <Card title={tr('brandName')} subtitle={tr('brandNameHint')} icon={<PanelTop size={17} />}>
          <TextInput
            value={draft.settings.brandName}
            data-testid="brand-name"
            onChange={(e) => setSettings((s) => ({ ...s, brandName: e.target.value }))}
            onFocus={() => flash(draft.settings.brandName)}
            onBlur={() => { if (!draft.settings.brandName.trim()) setSettings((s) => ({ ...s, brandName: DEFAULT_SETTINGS.brandName })); }}
            className="font-semibold"
          />
        </Card>
      )}

      {images.length > 0 && (
        <Card title={tr('imagesSection')} subtitle={tr('pageImagesHint')} icon={<Images size={17} />}>
          <div className={`grid gap-5 ${images.length > 1 ? 'sm:grid-cols-2' : 'max-w-xs'}`}>
            {images.map((im) => (
              <div key={im.key}>
                <FieldLabel>{tr(im.label)}</FieldLabel>
                <ImagePicker
                  value={draft.settings[im.key]}
                  onChange={(img) => setSettings((s) => ({ ...s, [im.key]: img }))}
                  gallery={draft.gallery}
                  tr={tr}
                  contain={im.contain}
                  aspect={im.aspect}
                  maxDimension={im.key === 'logoImage' ? 512 : undefined}
                  testId={`img-${im.key}`}
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {toggles.length > 0 && (
        <Card title={tr('visibleSections')} icon={<Eye size={17} />}>
          <div className="grid sm:grid-cols-2 gap-x-6">
            {toggles.map((k) => (
              <Toggle
                key={k}
                testId={`toggle-${k}`}
                checked={draft.settings.sections[k]}
                onChange={(v) => setSettings((s) => ({ ...s, sections: { ...s.sections, [k]: v } }))}
                label={tr(`sec_${k}` as AdminKey)}
              />
            ))}
          </div>
        </Card>
      )}

      {!searching && page.id === 'contact' && (
        <Card title={tr('socialLinks')} subtitle={tr('socialHint')} icon={<Globe size={17} />}>
          <div className="space-y-2.5">
            {draft.settings.socials.map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <span className="w-9 h-9 shrink-0 rounded-lg bg-brand-soft text-brand-ink flex items-center justify-center">
                  <SocialIcon platform={s.platform} size={17} />
                </span>
                <select
                  value={s.platform}
                  onChange={(e) => setSettings((st) => ({
                    ...st, socials: st.socials.map((x) => (x.id === s.id ? { ...x, platform: e.target.value } : x)),
                  }))}
                  className="shrink-0 bg-white border border-brand-border rounded-lg px-2 py-2 text-sm text-brand-ink focus:outline-none"
                >
                  {SOCIAL_PLATFORMS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
                <input
                  value={s.url}
                  placeholder={tr('socialUrlPlaceholder')}
                  onChange={(e) => setSettings((st) => ({
                    ...st, socials: st.socials.map((x) => (x.id === s.id ? { ...x, url: e.target.value } : x)),
                  }))}
                  className={`${inputCls} !py-2 min-w-0 flex-1`}
                />
                <button
                  type="button"
                  onClick={() => setSettings((st) => ({ ...st, socials: st.socials.filter((x) => x.id !== s.id) }))}
                  className="p-2 shrink-0 rounded-lg border border-brand-border text-brand-slate hover:text-red-500 hover:border-red-200"
                  title={tr('remove')}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSettings((st) => ({ ...st, socials: [...st.socials, makeSocialLink()] }))}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:underline mt-3"
          >
            <Plus size={15} /> {tr('addSocial')}
          </button>
        </Card>
      )}

      {!searching && page.id === 'booking' && (
        <Card title={tr('bookingTimes')} subtitle={tr('bookingTimesHint')} icon={<CalendarClock size={17} />}>
          <div className="flex flex-wrap gap-2">
            {draft.settings.bookingTimes.map((t, i) => (
              <div key={i} className="flex items-center gap-1 bg-brand-soft rounded-lg pl-1 pr-1">
                <input
                  value={t}
                  title={TIME_RE.test(t.trim()) ? undefined : tr('invalidTime')}
                  aria-invalid={!TIME_RE.test(t.trim())}
                  onChange={(e) => setSettings((s) => ({ ...s, bookingTimes: s.bookingTimes.map((x, j) => (j === i ? e.target.value : x)) }))}
                  className={`w-20 bg-white border rounded-md px-2 py-1.5 text-sm font-mono text-center focus:outline-none my-1 ${
                    TIME_RE.test(t.trim()) && draft.settings.bookingTimes.filter((x) => x.trim() === t.trim()).length === 1
                      ? 'border-brand-border focus:border-brand-primary'
                      : 'border-red-400 text-red-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setSettings((s) => ({ ...s, bookingTimes: s.bookingTimes.filter((_, j) => j !== i) }))}
                  className="p-1 text-brand-slate hover:text-red-500"
                  title={tr('remove')}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setSettings((s) => ({ ...s, bookingTimes: [...s.bookingTimes, nextFreeTime(s.bookingTimes)] }))}
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-primary px-3 rounded-lg border border-dashed border-brand-primary/40 hover:bg-brand-soft"
            >
              <Plus size={14} /> {tr('addTime')}
            </button>
          </div>
          {draft.settings.bookingTimes.some((t) => !TIME_RE.test(t.trim())) && (
            <p className="text-xs text-red-600 mt-2">{tr('invalidTime')}</p>
          )}
          <div className="mt-4 max-w-[200px]">
            <FieldLabel>{tr('bookingDays')}</FieldLabel>
            <TextInput
              type="number"
              min={1}
              max={30}
              value={draft.settings.bookingDays}
              onChange={(e) => setSettings((s) => ({ ...s, bookingDays: Math.max(1, Math.min(30, Number(e.target.value) || 1)) }))}
            />
          </div>
        </Card>
      )}

      {!searching && page.id === 'seo' && (
        <p className="text-sm text-brand-slate px-1">{tr('seoHint')}</p>
      )}

      {/* Translatable texts */}
      {visibleSections.map((key) => (
        <NodeEditor key={key} path={[key]} ctx={ctx} depth={0} />
      ))}
      {searching && !visibleSections.some((k) => ctx.langs.some((l) => matches(draft.content[l][k], [k], ctx.query))) && (
        <p className="text-center text-sm text-brand-slate py-10">{tr('noFieldsMatch')}</p>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-4 min-h-0">
      {/* Page tabs + tools */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
          {pages.map((p) => {
            const Icon = p.icon;
            const active = !searching && p.id === page.id;
            return (
              <button
                key={p.id}
                type="button"
                data-testid={`page-${p.id}`}
                onClick={() => { setQuery(''); setPageId(p.id); setPreviewRoute(null); }}
                className={`inline-flex items-center gap-2 whitespace-nowrap px-3.5 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                  active
                    ? 'bg-brand-ink text-white border-brand-ink'
                    : 'bg-white text-brand-text border-brand-border hover:border-brand-primary/40 hover:text-brand-ink'
                }`}
              >
                <Icon size={15} /> {tr(p.label)}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-slate" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tr('searchPlaceholder')}
              data-testid="content-search"
              className={`${inputCls} !pl-9 !py-2`}
            />
          </div>
          <button
            type="button"
            onClick={() => setCompare((c) => !c)}
            data-testid="compare-langs"
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold border transition-colors ${
              compare ? 'bg-brand-soft text-brand-primary border-brand-primary/30' : 'bg-white text-brand-text border-brand-border hover:text-brand-ink'
            }`}
          >
            <Languages size={15} /> {tr('compareLangs')}
          </button>
          {!searching && (
            <button
              type="button"
              onClick={resetPage}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold border bg-white text-brand-text border-brand-border hover:text-brand-ink"
            >
              <RotateCcw size={15} /> {tr('resetPage')}
            </button>
          )}
          <button
            type="button"
            onClick={() => setMobilePreview(true)}
            className={`${compare ? '' : 'xl:hidden'} inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold border bg-white text-brand-text border-brand-border`}
          >
            <Eye size={15} /> {tr('openPreview')}
          </button>
        </div>
      </div>

      <div className={`grid gap-5 items-start ${compare ? '' : 'xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]'}`}>
        {editor}
        {!compare && wide && (
          <div className="sticky top-[84px] h-[calc(100vh-108px)]">
            <PreviewPane
              route={route}
              lang={lang}
              draft={draft}
              tr={tr}
              highlight={highlight}
              routes={routes}
              onRouteChange={setPreviewRoute}
              className="h-full"
            />
          </div>
        )}
      </div>

      {mobilePreview && (
        <div className="fixed inset-0 z-[60] bg-brand-ink/60 p-2 sm:p-6 flex flex-col">
          <button
            type="button"
            onClick={() => setMobilePreview(false)}
            className="self-end mb-2 inline-flex items-center gap-1.5 bg-white rounded-xl px-3 py-2 text-sm font-semibold"
          >
            <X size={15} /> {tr('close')}
          </button>
          <PreviewPane route={route} lang={lang} draft={draft} tr={tr} highlight={highlight} routes={routes} onRouteChange={setPreviewRoute} className="flex-1" />
        </div>
      )}
    </div>
  );
}
