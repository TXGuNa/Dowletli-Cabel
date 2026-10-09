// Döwletli admin panel.
//
// Everything is edited in a local DRAFT; the live preview shows the draft;
// Publish uploads new images and saves the whole site to the server (Cloudflare
// KV), after which every visitor gets the new version.

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, FileText, Boxes, Images, Palette, Settings as SettingsIcon, Inbox, LogOut, ExternalLink,
  Save, Check, Loader2, Undo2, Menu, X, AlertTriangle, CloudOff, RefreshCw, CheckCircle2, CircleDot, Globe,
} from 'lucide-react';
import { useContentStore } from '../content/ContentContext';
import { useProducts } from '../content/ProductsContext';
import { useGallery } from '../content/GalleryContext';
import { useSettings } from '../content/SettingsContext';
import { LANGS, LANG_LABELS, mergeContent } from '../content/contentStore';
import type { Lang } from '../content/detectLanguage';
import { normalizeProducts } from '../content/productsStore';
import { normalizeGallery } from '../content/galleryStore';
import { normalizeSettings } from '../content/settingsStore';
import { adminT, type AdminKey } from '../content/adminStrings';
import { ApiError, clearSession, fetchSite, getAdminUsername, getToken, publishSite } from '../content/api';
import { setCachedRev } from '../content/siteSync';
import { uploadInlineImages } from './images';
import { clone, stableStringify, VIEWS, type Draft, type View } from './types';
import Login from './Login';
import DashboardView from './DashboardView';
import PagesView from './PagesView';
import ProductsView from './ProductsView';
import GalleryView from './GalleryView';
import ThemeView from './ThemeView';
import SettingsView from './SettingsView';
import RequestsView from './RequestsView';
import { useServerSubmissions } from './submissions';

const NAV: { view: View; label: AdminKey; icon: typeof FileText }[] = [
  { view: 'dashboard', label: 'navDashboard', icon: LayoutDashboard },
  { view: 'pages', label: 'navPages', icon: FileText },
  { view: 'products', label: 'tabProducts', icon: Boxes },
  { view: 'gallery', label: 'tabGallery', icon: Images },
  { view: 'theme', label: 'navTheme', icon: Palette },
  { view: 'settings', label: 'navSettings', icon: SettingsIcon },
  { view: 'requests', label: 'tabRequests', icon: Inbox },
];

const UI_LANG_KEY = 'dowletli_admin_ui_lang';
const isLang = (v: unknown): v is Lang => v === 'en' || v === 'ru' || v === 'tkm';

function readView(): View {
  const h = window.location.hash.replace('#', '').split('/')[0];
  return (VIEWS as string[]).includes(h) ? (h as View) : 'dashboard';
}

export default function AdminApp() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { content, saveContent, defaults } = useContentStore();
  const { products, setProducts } = useProducts();
  const { images, setImages } = useGallery();
  const { settings, setSettings } = useSettings();

  const [authed, setAuthed] = useState(() => !!getToken());
  const [loginNotice, setLoginNotice] = useState<AdminKey | null>(null);
  const [view, setViewState] = useState<View>(readView);
  const [pageId, setPageId] = useState('home');
  const [uiLang, setUiLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem(UI_LANG_KEY);
      if (isLang(saved)) return saved;
    } catch { /* ignore */ }
    return isLang(i18n.language) ? i18n.language : 'en';
  });
  const [lang, setLang] = useState<Lang>('en');
  const [navOpen, setNavOpen] = useState(false);

  const [draft, setDraft] = useState<Draft>(() => clone({ content, products, gallery: images, settings }));
  const [sync, setSync] = useState<'loading' | 'ready' | 'error'>('loading');
  const [remoteEmpty, setRemoteEmpty] = useState(false);
  const [baseRev, setBaseRev] = useState(0);
  const [saving, setSaving] = useState<false | 'images' | 'publish'>(false);
  const [progress, setProgress] = useState<[number, number]>([0, 0]);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  const tr = adminT(uiLang);

  useEffect(() => {
    try { localStorage.setItem(UI_LANG_KEY, uiLang); } catch { /* ignore */ }
  }, [uiLang]);

  const setView = (v: View) => {
    setViewState(v);
    setNavOpen(false);
    window.history.replaceState(null, '', `#${v}`);
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    const onHash = () => setViewState(readView());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const handleAuthError = () => {
    clearSession();
    setLoginNotice('sessionExpired');
    setAuthed(false);
  };

  const subs = useServerSubmissions(authed, handleAuthError);
  const unread = subs.items.filter((s) => !s.read).length;

  // Published version (what visitors see) — compared part by part to the draft,
  // in normalized, key-order-independent form so equal data never looks "dirty".
  const same = (a: unknown, b: unknown) => stableStringify(a) === stableStringify(b);
  const dirtyContent = useMemo(() => !same(draft.content, content), [draft.content, content]);
  const dirtyProducts = useMemo(() => !same(normalizeProducts(draft.products), products), [draft.products, products]);
  const dirtyGallery = useMemo(() => !same(normalizeGallery(draft.gallery), images), [draft.gallery, images]);
  const dirtySettings = useMemo(() => !same(normalizeSettings(draft.settings), settings), [draft.settings, settings]);
  const dirty = dirtyContent || dirtyProducts || dirtyGallery || dirtySettings;
  const status: 'live' | 'dirty' | 'never' = remoteEmpty ? 'never' : dirty ? 'dirty' : 'live';

  // Load the published version from the server and edit that.
  const loadedOnce = useRef(false);
  const [remoteNewer, setRemoteNewer] = useState(false);
  const loadFromServer = async () => {
    setSync('loading');
    setRemoteNewer(false);
    try {
      const doc = await fetchSite();
      if (doc) {
        const next: Draft = {
          content: mergeContent(doc.content),
          products: normalizeProducts(doc.products),
          gallery: normalizeGallery(doc.gallery),
          settings: normalizeSettings(doc.settings),
        };
        saveContent(clone(next.content));
        setProducts(clone(next.products));
        setImages(clone(next.gallery));
        setSettings(clone(next.settings));
        setCachedRev(doc.updatedAt);
        setDraft(next);
        setBaseRev(doc.updatedAt);
        setRemoteEmpty(false);
      } else {
        setBaseRev(0);
        setRemoteEmpty(true);
      }
      loadedOnce.current = true;
      setSync('ready');
    } catch {
      setSync('error');
    }
  };

  useEffect(() => {
    if (!authed) return;
    // Signed in again after the session expired: keep the unpublished edits.
    // (baseRev stays, so a newer server version still triggers the conflict check.)
    if (loadedOnce.current && dirty) {
      setSync('ready');
      return;
    }
    loadFromServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  // Notice when someone publishes from another tab / device.
  useEffect(() => {
    if (!authed || sync !== 'ready') return;
    const check = async () => {
      if (document.hidden) return;
      try {
        const doc = await fetchSite();
        if (doc && doc.updatedAt > baseRev) setRemoteNewer(true);
      } catch { /* offline — ignore */ }
    };
    const id = window.setInterval(check, 60_000);
    window.addEventListener('focus', check);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('focus', check);
    };
  }, [authed, sync, baseRev]);

  useEffect(() => {
    if (authed && view === 'requests') subs.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const canSave = sync === 'ready' && !saving && (dirty || remoteEmpty);

  const handleSave = async (force = false): Promise<void> => {
    const startDraft = draft;
    setSaveError(null);
    try {
      setSaving('images');
      const up = await uploadInlineImages(draft.products, draft.gallery, draft.settings, (d, t) => setProgress([d, t]));
      setSaving('publish');
      // Publish the normalized form, so what is stored == what the site renders.
      const doc: Draft = {
        content: mergeContent(draft.content),
        products: normalizeProducts(up.products),
        gallery: normalizeGallery(up.gallery),
        settings: normalizeSettings(up.settings),
      };
      const rev = await publishSite(doc, baseRev, force);
      saveContent(clone(doc.content));
      setProducts(clone(doc.products));
      setImages(clone(doc.gallery));
      setSettings(clone(doc.settings));
      setCachedRev(rev);
      // Show the stored version in the editor, unless the admin kept typing meanwhile.
      setDraft((d) => (d === startDraft ? clone(doc) : d));
      setBaseRev(rev);
      setRemoteEmpty(false);
      setRemoteNewer(false);
      setSavedFlash(true);
      window.setTimeout(() => setSavedFlash(false), 2200);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        handleAuthError();
        return;
      }
      if (e instanceof ApiError && e.status === 409) {
        if (confirm(tr('conflictOverwrite'))) {
          await handleSave(true);
          return;
        }
        setSaveError(tr('conflictInfo'));
        return;
      }
      const code = e instanceof ApiError ? e.code : e instanceof Error ? e.message : '';
      setSaveError(`${tr('publishFailed')}${code ? ` (${code})` : ''}`);
    } finally {
      setSaving(false);
    }
  };

  const discard = () => {
    if (!confirm(tr('confirmDiscard'))) return;
    setDraft(clone({ content, products, gallery: images, settings }));
    setSaveError(null);
  };

  // Ctrl/⌘ + S publishes; warn before leaving with unpublished changes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (canSave) handleSave();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  if (!authed) {
    return (
      <Login
        notice={loginNotice}
        uiLang={uiLang}
        setUiLang={setUiLang}
        onOk={() => { setLoginNotice(null); setAuthed(true); }}
      />
    );
  }

  const logout = () => {
    clearSession();
    setAuthed(false);
    navigate('/');
  };

  const serviceLabel = (id: string): string => {
    const booking = content[uiLang]?.booking as unknown as { services?: Record<string, string> } | undefined;
    return (booking?.services && booking.services[id]) || id || '—';
  };

  const showLangPicker = view === 'pages' || view === 'products' || view === 'theme';
  const current = NAV.find((n) => n.view === view)!;

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 h-16 shrink-0">
        <img src={draft.settings.logoImage || '/assets/logo.png'} alt="" className="w-9 h-9 object-contain bg-white rounded-lg p-1" />
        <div className="min-w-0">
          <div className="font-extrabold text-white leading-tight truncate">{draft.settings.brandName}</div>
          <div className="text-[11px] text-white/50">{tr('adminSubtitle')}</div>
        </div>
      </div>
      <nav className="px-3 py-2 space-y-0.5 flex-1 overflow-y-auto">
        {NAV.map((n) => {
          const Icon = n.icon;
          const active = view === n.view;
          return (
            <button
              key={n.view}
              type="button"
              data-testid={`nav-${n.view}`}
              onClick={() => setView(n.view)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                active ? 'bg-white text-brand-ink shadow' : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon size={18} className={active ? 'text-brand-primary' : ''} />
              <span className="flex-1 text-left">{tr(n.label)}</span>
              {n.view === 'requests' && unread > 0 && (
                <span className="text-[11px] min-w-[20px] px-1.5 py-0.5 rounded-full bg-brand-cyan text-white text-center">{unread}</span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="p-3 space-y-2 border-t border-white/10">
        <label className="flex items-center gap-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">
          <Globe size={12} /> {tr('interfaceLanguage')}
        </label>
        <div className="grid grid-cols-3 gap-1 px-1">
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setUiLang(l)}
              className={`py-1.5 rounded-lg text-xs font-bold ${uiLang === l ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white'}`}
            >
              {l === 'tkm' ? 'TM' : l.toUpperCase()}
            </button>
          ))}
        </div>
        <Link to="/" target="_blank" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/10">
          <ExternalLink size={16} /> {tr('viewSite')}
        </Link>
        <button type="button" onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/10">
          <LogOut size={16} /> {tr('logout')} <span className="ml-auto text-[11px] text-white/40 truncate">{getAdminUsername()}</span>
        </button>
      </div>
    </div>
  );

  const statusChip = {
    live: <span className="inline-flex items-center gap-1.5 text-emerald-700"><CheckCircle2 size={15} /> <span className="hidden md:inline">{tr('statusPublished')}</span></span>,
    dirty: <span className="inline-flex items-center gap-1.5 text-amber-700"><CircleDot size={15} /> <span className="hidden md:inline">{tr('statusUnsaved')}</span></span>,
    never: <span className="inline-flex items-center gap-1.5 text-amber-700"><AlertTriangle size={15} /> <span className="hidden md:inline">{tr('statusNever')}</span></span>,
  }[status];

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-brand-text">
      {/* Sidebar — fixed on desktop, drawer on mobile */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-brand-ink z-40">{sidebar}</aside>
      {navOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-72 max-w-[85%] bg-brand-ink h-full shadow-2xl">{sidebar}</div>
          <button type="button" aria-label={tr('close')} className="flex-1 bg-black/40" onClick={() => setNavOpen(false)} />
        </div>
      )}

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur border-b border-brand-border flex items-center gap-2 sm:gap-3 px-3 sm:px-6">
          <button type="button" className="lg:hidden p-2 -ml-1 rounded-lg text-brand-ink hover:bg-brand-soft" onClick={() => setNavOpen(true)} aria-label={tr('menu')} data-testid="open-nav">
            <Menu size={22} />
          </button>
          <h1 className="text-base sm:text-lg font-extrabold text-brand-ink truncate">{tr(current.label)}</h1>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {showLangPicker && (
              <div className="flex items-center gap-1 bg-brand-soft rounded-xl p-1" title={tr('editingLanguage')} data-testid="edit-lang">
                {LANGS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLang(l)}
                    data-testid={`edit-lang-${l}`}
                    className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${lang === l ? 'bg-white text-brand-ink shadow-sm' : 'text-brand-slate hover:text-brand-ink'}`}
                  >
                    <span className="sm:hidden">{l === 'tkm' ? 'TM' : l.toUpperCase()}</span>
                    <span className="hidden sm:inline">{LANG_LABELS[l]}</span>
                  </button>
                ))}
              </div>
            )}
            <span
              className="text-sm font-semibold"
              data-testid="status-chip"
              role="status"
              title={status === 'live' ? tr('statusPublished') : status === 'dirty' ? tr('statusUnsaved') : tr('statusNever')}
              aria-label={status === 'live' ? tr('statusPublished') : status === 'dirty' ? tr('statusUnsaved') : tr('statusNever')}
            >
              {statusChip}
            </span>
            {dirty && !saving && (
              <button
                type="button"
                onClick={discard}
                title={tr('discard')}
                data-testid="discard"
                className="inline-flex items-center gap-1.5 p-2 sm:px-3 rounded-xl text-sm font-semibold text-brand-slate hover:text-brand-ink hover:bg-brand-soft"
              >
                <Undo2 size={16} /> <span className="hidden xl:inline">{tr('discard')}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={!canSave}
              data-testid="publish"
              title={tr('shortcutHint')}
              className="btn-primary !px-4 sm:!px-5 !py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-soft"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : savedFlash ? <Check size={16} /> : <Save size={16} />}
              <span className="hidden sm:inline">
                {saving === 'images'
                  ? `${tr('uploadingImages')}${progress[1] ? ` ${progress[0]}/${progress[1]}` : ''}`
                  : saving === 'publish' ? tr('publishing') : savedFlash ? tr('saved') : tr('publish')}
              </span>
            </button>
          </div>
        </header>

        <main className="p-3 sm:p-6 max-w-[1700px]">
          {/* Server status banners */}
          {(sync !== 'ready' || remoteEmpty || saveError || remoteNewer) && (
            <div className="space-y-3 mb-5">
              {sync === 'loading' && (
                <div className="flex items-center gap-2 text-sm font-medium text-brand-ink bg-white border border-brand-border px-4 py-3 rounded-xl">
                  <Loader2 size={16} className="animate-spin text-brand-primary" /> {tr('loadingSite')}
                </div>
              )}
              {sync === 'error' && (
                <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
                  <CloudOff size={16} /> <span className="flex-1 min-w-[200px]">{tr('loadFailed')}</span>
                  <button type="button" onClick={() => loadFromServer()} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-red-200 text-xs font-semibold">
                    <RefreshCw size={14} /> {tr('retry')}
                  </button>
                </div>
              )}
              {sync === 'ready' && remoteEmpty && (
                <div className="flex items-start gap-2 text-sm font-medium text-amber-800 bg-amber-50 border border-amber-200 px-4 py-3 rounded-xl" data-testid="never-published">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" /> {tr('notPublishedYet')}
                </div>
              )}
              {remoteNewer && (
                <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-blue-800 bg-blue-50 border border-blue-200 px-4 py-3 rounded-xl" data-testid="remote-newer">
                  <RefreshCw size={16} className="shrink-0" /> <span className="flex-1 min-w-[200px]">{tr('remoteNewer')}</span>
                  <button
                    type="button"
                    onClick={() => { if (!dirty || confirm(tr('confirmDiscard'))) loadFromServer(); }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-blue-200 text-xs font-semibold"
                  >
                    <RefreshCw size={14} /> {tr('loadLatest')}
                  </button>
                </div>
              )}
              {saveError && (
                <div className="flex items-start gap-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-xl" data-testid="save-error">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" /> {saveError}
                  <button type="button" onClick={() => setSaveError(null)} className="ml-auto p-0.5"><X size={15} /></button>
                </div>
              )}
            </div>
          )}

          {view === 'dashboard' && (
            <DashboardView
              draft={draft}
              tr={tr}
              status={status}
              lastPublished={baseRev}
              submissions={subs.items}
              serviceLabel={serviceLabel}
              go={setView}
              openPage={(id) => { setPageId(id); setView('pages'); }}
            />
          )}
          {view === 'pages' && (
            <PagesView
              draft={draft}
              update={setDraft}
              lang={lang}
              uiLang={uiLang}
              tr={tr}
              defaults={defaults}
              pageId={pageId}
              setPageId={setPageId}
            />
          )}
          {view === 'products' && (
            <ProductsView
              products={draft.products}
              setProducts={(next) => setDraft((d) => ({ ...d, products: next }))}
              gallery={draft.gallery}
              lang={lang}
              uiLang={uiLang}
              tr={tr}
            />
          )}
          {view === 'gallery' && (
            <GalleryView
              images={draft.gallery}
              setImages={(next) => setDraft((d) => ({ ...d, gallery: next }))}
              uiLang={uiLang}
              tr={tr}
            />
          )}
          {view === 'theme' && <ThemeView draft={draft} update={setDraft} lang={lang} uiLang={uiLang} tr={tr} />}
          {view === 'settings' && (
            <SettingsView draft={draft} update={setDraft} tr={tr} defaults={defaults} onAuthError={handleAuthError} />
          )}
          {view === 'requests' && (
            <div className="max-w-5xl">
              <p className="text-brand-slate text-sm mb-5">{tr('requestsSubtitle')}</p>
              <RequestsView serviceLabel={serviceLabel} tr={tr} subs={subs} />
              <p className="text-center text-xs text-brand-slate mt-10 max-w-xl mx-auto">{tr('requestsNote')}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
