// Side effects that follow the published (or previewed) site data:
// - ThemeManager: applies the selected theme's CSS variables + fonts
// - SeoManager:   browser tab title, meta description, favicon
// - PreviewBridge: receives unsaved drafts from the admin panel when the site is
//                  shown inside the admin's live-preview iframe (?preview=1)

import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSettings } from './SettingsContext';
import { useContentStore } from './ContentContext';
import { useProducts } from './ProductsContext';
import { useGallery } from './GalleryContext';
import { applyTheme, clearTheme, rememberBoot } from './themes';
import { IS_PREVIEW } from './cache';
import { mergeContent } from './contentStore';
import { normalizeProducts } from './productsStore';
import { normalizeGallery } from './galleryStore';
import { normalizeSettings } from './settingsStore';

export const PREVIEW_MSG = 'dowletli-preview';
export const PREVIEW_READY_MSG = 'dowletli-preview-ready';

export function ThemeManager() {
  const { settings } = useSettings();
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  const themeKey = JSON.stringify(settings.theme);

  useLayoutEffect(() => {
    // The admin panel keeps its own neutral look; the site gets the theme.
    if (isAdmin) clearTheme();
    else applyTheme(settings.theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeKey, isAdmin]);

  return null;
}

const PAGE_TITLE_KEY: Record<string, string> = {
  '/about': 'nav.about',
  '/products': 'nav.products',
  '/gallery': 'nav.gallery',
  '/contact': 'nav.contact',
  '/book': 'booking.title',
};

function setMeta(selector: string, attr: string, value: string, create: () => HTMLElement) {
  let el = document.head.querySelector(selector) as HTMLElement | null;
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

export function SeoManager() {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const { content } = useContentStore();
  const { pathname: rawPath } = useLocation();
  const pathname = rawPath.replace(/\/+$/, '') || '/';

  useEffect(() => {
    if (pathname.startsWith('/admin')) {
      document.title = 'Admin | ' + settings.brandName;
      return;
    }
    const siteTitle = t('seo.title') || settings.brandName;
    const known = pathname === '/' || pathname in PAGE_TITLE_KEY;
    const pageKey = known ? PAGE_TITLE_KEY[pathname] : 'notFound.title';
    const title = pageKey ? `${t(pageKey)} | ${siteTitle}` : siteTitle;
    document.title = title.replace(/<\/?\d+>/g, '');
    const description = t('seo.description');
    setMeta('meta[name="description"]', 'content', description, () => {
      const m = document.createElement('meta');
      m.setAttribute('name', 'description');
      return m;
    });
    setMeta('meta[property="og:title"]', 'content', document.title, () => {
      const m = document.createElement('meta');
      m.setAttribute('property', 'og:title');
      return m;
    });
    setMeta('meta[property="og:description"]', 'content', description, () => {
      const m = document.createElement('meta');
      m.setAttribute('property', 'og:description');
      return m;
    });
    document.documentElement.lang = i18n.language === 'tkm' ? 'tk' : i18n.language;
  }, [t, i18n.language, pathname, content, settings.brandName]);

  useEffect(() => {
    const href = settings.logoImage || '/assets/logo.png';
    rememberBoot({ logo: href });
    setMeta('link[rel="icon"]', 'href', href, () => {
      const l = document.createElement('link');
      l.setAttribute('rel', 'icon');
      return l;
    });
  }, [settings.logoImage]);

  return null;
}

interface PreviewPayload {
  type: typeof PREVIEW_MSG;
  content?: unknown;
  products?: unknown;
  gallery?: unknown;
  settings?: unknown;
}

export function PreviewBridge() {
  const { saveContent } = useContentStore();
  const { setProducts } = useProducts();
  const { setImages } = useGallery();
  const { setSettings } = useSettings();

  useEffect(() => {
    if (!IS_PREVIEW || window.parent === window) return;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const d = e.data as PreviewPayload;
      if (!d || d.type !== PREVIEW_MSG) return;
      if (d.content) saveContent(mergeContent(d.content));
      if (d.products) setProducts(normalizeProducts(d.products));
      if (d.gallery) setImages(normalizeGallery(d.gallery));
      if (d.settings) setSettings(normalizeSettings(d.settings));
    };
    window.addEventListener('message', onMessage);
    window.parent.postMessage({ type: PREVIEW_READY_MSG }, window.location.origin);
    return () => window.removeEventListener('message', onMessage);
    // The setters only call stable state setters + cache writes, so the ones
    // captured on mount stay valid for the lifetime of the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
