// Live preview of the public site inside the admin panel.
// The iframe loads the real site with ?preview=1 and receives the UNSAVED draft
// via postMessage, so every edit (text, image, theme…) shows immediately.

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ExternalLink, Monitor, RefreshCw, Smartphone, Tablet } from 'lucide-react';
import { PREVIEW_MSG, PREVIEW_READY_MSG } from '../content/SiteEffects';
import type { Lang } from '../content/detectLanguage';
import type { Draft, Tr } from './types';

export type Device = 'desktop' | 'tablet' | 'mobile';
const DEVICE_WIDTH: Record<Device, number> = { desktop: 1280, tablet: 820, mobile: 390 };

// Find text inside the preview, scroll to it and flash an outline.
function flashInPreview(doc: Document | null | undefined, text: string): boolean {
  if (!doc || !doc.body) return false;
  const parts = text.split(/<\/?\d+>/).map((s) => s.trim()).filter(Boolean);
  const longest = parts.sort((a, b) => b.length - a.length)[0] || '';
  const needle = longest.slice(0, 30).toLowerCase();
  if (needle.length < 2) return false;
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  let el: HTMLElement | null = null;
  while (walker.nextNode()) {
    const t = (walker.currentNode.nodeValue || '').trim().toLowerCase();
    if (t.length >= 2 && t.includes(needle)) {
      el = walker.currentNode.parentElement as HTMLElement | null;
      break;
    }
  }
  if (!el) return false;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const prev = el.style.cssText;
  el.style.outline = '3px solid #2563EB';
  el.style.outlineOffset = '3px';
  el.style.borderRadius = '8px';
  el.style.backgroundColor = 'rgba(37,99,235,0.10)';
  const target = el;
  window.setTimeout(() => { target.style.cssText = prev; }, 2200);
  return true;
}

export interface Highlight {
  text: string;
  n: number;
}

export function PreviewPane({
  route, lang, draft, tr, highlight, routes, onRouteChange, className = '',
}: {
  route: string;
  lang: Lang;
  draft: Draft;
  tr: Tr;
  highlight?: Highlight | null;
  routes?: { path: string; label: string }[];
  onRouteChange?: (path: string) => void;
  className?: string;
}) {
  const [device, setDevice] = useState<Device>(() => {
    try {
      return (localStorage.getItem('dowletli_admin_device') as Device) || 'desktop';
    } catch {
      return 'desktop';
    }
  });
  const [reloadKey, setReloadKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(false);
  const draftRef = useRef(draft);
  const [box, setBox] = useState({ w: 600, h: 600 });

  const src = `${route === '/' ? '/' : route}?lang=${lang}&preview=1`;

  useEffect(() => {
    try {
      localStorage.setItem('dowletli_admin_device', device);
    } catch {
      /* ignore */
    }
  }, [device]);

  // Fit the virtual device into the pane.
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBox({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setBox({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const post = () => {
    const win = iframeRef.current?.contentWindow;
    if (!win || !readyRef.current) return;
    const d = draftRef.current;
    win.postMessage(
      { type: PREVIEW_MSG, content: d.content, products: d.products, gallery: d.gallery, settings: d.settings },
      window.location.origin,
    );
  };

  // The iframe says "ready" each time it (re)loads -> send it the draft.
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.source !== iframeRef.current?.contentWindow) return;
      if ((e.data as { type?: string })?.type === PREVIEW_READY_MSG) {
        readyRef.current = true;
        post();
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // Send edits (debounced) as the admin types.
  useEffect(() => {
    draftRef.current = draft;
    const id = window.setTimeout(post, 120);
    return () => window.clearTimeout(id);
  }, [draft]);

  useEffect(() => {
    readyRef.current = false;
  }, [src, reloadKey]);

  // Scroll to + flash the field being edited.
  useEffect(() => {
    if (!highlight?.text) return;
    let n = 0;
    const tick = () => {
      if (flashInPreview(iframeRef.current?.contentDocument, highlight.text)) return;
      if (++n < 10) window.setTimeout(tick, 250);
    };
    const id = window.setTimeout(tick, 200);
    return () => window.clearTimeout(id);
  }, [highlight]);

  const vw = DEVICE_WIDTH[device];
  const scale = Math.min(1, (box.w - 16) / vw);
  const frameH = Math.max(300, (box.h - 16) / scale);

  return (
    <div className={`flex flex-col rounded-2xl border border-brand-border bg-white overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 px-3 py-2 border-b border-brand-border bg-slate-50/80">
        <span className="hidden xl:flex gap-1.5 mr-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-300" />
        </span>
        {routes && onRouteChange ? (
          <select
            value={route}
            onChange={(e) => onRouteChange(e.target.value)}
            data-testid="preview-route"
            className="bg-white border border-brand-border rounded-lg px-2 py-1 text-xs font-semibold text-brand-ink focus:outline-none cursor-pointer max-w-[45%]"
          >
            {routes.map((r) => (
              <option key={r.path} value={r.path}>{r.label}</option>
            ))}
          </select>
        ) : (
          <span className="text-xs font-semibold text-brand-ink truncate">{route}</span>
        )}
        <div className="ml-auto flex items-center gap-0.5 bg-white border border-brand-border rounded-lg p-0.5">
          {([
            ['desktop', Monitor, tr('deviceDesktop')],
            ['tablet', Tablet, tr('deviceTablet')],
            ['mobile', Smartphone, tr('deviceMobile')],
          ] as const).map(([d, Icon, label]) => (
            <button
              key={d}
              type="button"
              title={label}
              data-testid={`device-${d}`}
              onClick={() => setDevice(d)}
              className={`p-1.5 rounded-md transition-colors ${device === d ? 'bg-brand-ink text-white' : 'text-brand-slate hover:text-brand-ink'}`}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setReloadKey((k) => k + 1)}
          title={tr('refresh')}
          className="p-1.5 rounded-lg text-brand-slate hover:text-brand-ink hover:bg-white transition-colors"
        >
          <RefreshCw size={14} />
        </button>
        <a
          href={`${route}?lang=${lang}`}
          target="_blank"
          rel="noreferrer"
          title={tr('viewSite')}
          className="p-1.5 rounded-lg text-brand-slate hover:text-brand-ink hover:bg-white transition-colors"
        >
          <ExternalLink size={14} />
        </a>
      </div>
      <div ref={boxRef} className="relative flex-1 min-h-0 bg-[repeating-conic-gradient(#f1f5f9_0%_25%,#f8fafc_0%_50%)] bg-[length:16px_16px] overflow-hidden">
        <div
          className="absolute top-2 left-1/2 bg-white shadow-xl rounded-md overflow-hidden"
          style={{ width: vw, height: frameH, transform: `translateX(-50%) scale(${scale})`, transformOrigin: 'top center' }}
        >
          <iframe
            key={`${src}-${reloadKey}`}
            ref={iframeRef}
            src={src}
            title="Live preview"
            data-testid="preview-frame"
            className="w-full h-full border-0 bg-white"
          />
        </div>
      </div>
      <div className="px-3 py-1.5 text-[11px] text-brand-slate border-t border-brand-border bg-slate-50/80">
        {tr('previewDraftNote')}
      </div>
    </div>
  );
}
