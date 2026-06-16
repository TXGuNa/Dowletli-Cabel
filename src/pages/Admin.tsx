import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Lock, Save, RotateCcw, Download, Upload, LogOut, ExternalLink,
  Search, Plus, Trash2, Check, Inbox, FileText, Mail, CalendarClock, RefreshCw,
  Eye, EyeOff, MonitorSmartphone, Boxes, ImagePlus, X, Globe, ChevronDown,
} from 'lucide-react';
import { useContentStore } from '../content/ContentContext';
import {
  type AllContent, type Json, type LangContent,
  LANGS, LANG_LABELS,
} from '../content/contentStore';
import type { Lang } from '../content/detectLanguage';
import { verifyCredentials } from '../content/auth';
import {
  type Submission, SUBMISSIONS_EVENT,
  loadSubmissions, markRead, deleteSubmission, clearSubmissions,
} from '../content/submissionsStore';
import { useProducts } from '../content/ProductsContext';
import { type Product, makeEmptyProduct } from '../content/productsStore';
import { adminT, sectionLabel, fieldLabel, type AdminKey } from '../content/adminStrings';

type Tr = (k: AdminKey) => string;

const AUTH_KEY = 'dowletli_admin_ok';

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function setByPath(root: LangContent, path: (string | number)[], value: Json): LangContent {
  const next = clone(root);
  let cur = next as unknown as Record<string | number, Json>;
  for (let i = 0; i < path.length - 1; i++) {
    cur = cur[path[i]] as unknown as Record<string | number, Json>;
  }
  cur[path[path.length - 1]] = value;
  return next;
}

function matches(value: Json, path: (string | number)[], q: string): boolean {
  if (!q) return true;
  const inPath = path.join('.').toLowerCase().includes(q);
  if (typeof value === 'string') return inPath || value.toLowerCase().includes(q);
  if (Array.isArray(value)) return inPath || value.some((v, i) => matches(v, [...path, i], q));
  if (value && typeof value === 'object') {
    return inPath || Object.entries(value).some(([k, v]) => matches(v, [...path, k], q));
  }
  return inPath;
}

// ---- Leaf editors ----------------------------------------------------------

function StringField({
  value, path, onChange, lang,
}: { value: string; path: (string | number)[]; onChange: (p: (string | number)[], v: Json) => void; lang: Lang }) {
  const label = fieldLabel(String(path[path.length - 1]), lang);
  const long = value.length > 60;
  return (
    <div>
      <label className="block text-sm font-semibold text-brand-ink mb-1.5">{label}</label>
      {long ? (
        <textarea
          value={value}
          rows={Math.min(6, Math.ceil(value.length / 60))}
          onChange={(e) => onChange(path, e.target.value)}
          className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-2.5 text-brand-text focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:outline-none resize-y"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(path, e.target.value)}
          className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-2.5 text-brand-text focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:outline-none"
        />
      )}
    </div>
  );
}

function ArrayField({
  value, path, onChange, tr, lang,
}: { value: Json[]; path: (string | number)[]; onChange: (p: (string | number)[], v: Json) => void; tr: Tr; lang: Lang }) {
  const label = fieldLabel(String(path[path.length - 1]), lang);
  return (
    <div>
      <label className="block text-sm font-semibold text-brand-ink mb-1.5">{label}</label>
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="flex gap-2 items-start">
            <input
              value={String(item)}
              onChange={(e) => onChange([...path, i], e.target.value)}
              className="flex-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-2.5 text-brand-text focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => onChange(path, value.filter((_, j) => j !== i))}
              className="p-2.5 rounded-xl border border-brand-border text-brand-slate hover:text-red-500 hover:border-red-200 transition-colors"
              title="Remove"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange(path, [...value, ''])}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline"
        >
          <Plus size={15} /> {tr('addItem')}
        </button>
      </div>
    </div>
  );
}

function NodeEditor({
  value, path, onChange, query, depth, tr, lang,
}: {
  value: Json;
  path: (string | number)[];
  onChange: (p: (string | number)[], v: Json) => void;
  query: string;
  depth: number;
  tr: Tr;
  lang: Lang;
}) {
  if (typeof value === 'string') {
    if (!matches(value, path, query)) return null;
    return <StringField value={value} path={path} onChange={onChange} lang={lang} />;
  }
  if (Array.isArray(value)) {
    if (value.every((v) => typeof v === 'string')) {
      if (!matches(value, path, query)) return null;
      return <ArrayField value={value} path={path} onChange={onChange} tr={tr} lang={lang} />;
    }
    return null;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value).filter(([k, v]) => matches(v, [...path, k], query));
    if (entries.length === 0) return null;

    if (depth === 0) {
      const title = sectionLabel(String(path[path.length - 1]), lang);
      return (
        <section className="bg-white border border-brand-border rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-bold text-brand-ink mb-5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-primary" />
            {title}
          </h3>
          <div className="grid sm:grid-cols-2 gap-5">
            {entries.map(([k, v]) => (
              <div key={k} className={typeof v === 'object' && v !== null && !Array.isArray(v) ? 'sm:col-span-2' : ''}>
                <NodeEditor value={v} path={[...path, k]} onChange={onChange} query={query} depth={depth + 1} tr={tr} lang={lang} />
              </div>
            ))}
          </div>
        </section>
      );
    }

    return (
      <div className="rounded-xl border border-brand-border/70 bg-brand-bg/40 p-4">
        <div className="text-sm font-bold text-brand-ink mb-3">{fieldLabel(String(path[path.length - 1]), lang)}</div>
        <div className="grid sm:grid-cols-2 gap-4">
          {entries.map(([k, v]) => (
            <div key={k} className={typeof v === 'object' && v !== null && !Array.isArray(v) ? 'sm:col-span-2' : ''}>
              <NodeEditor value={v} path={[...path, k]} onChange={onChange} query={query} depth={depth + 1} tr={tr} lang={lang} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

// ---- Login -----------------------------------------------------------------

function Login({ onOk }: { onOk: () => void }) {
  const { i18n } = useTranslation();
  const lang = (['en', 'ru', 'tkm'].includes(i18n.language) ? i18n.language : 'en') as Lang;
  const tr = adminT(lang);
  const [user, setUser] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    const ok = await verifyCredentials(user, pw);
    setChecking(false);
    if (ok) {
      sessionStorage.setItem(AUTH_KEY, '1');
      onOk();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora" />
      <div className="absolute top-10 left-1/4 w-[420px] h-[420px] bg-brand-primary/20 rounded-full blur-[130px] animate-drift-slow" />
      <div className="absolute bottom-10 right-1/4 w-[420px] h-[420px] bg-brand-cyan/20 rounded-full blur-[130px] animate-drift" />
      <form
        onSubmit={submit}
        className="relative glass-strong rounded-3xl p-8 w-full max-w-sm"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-cyan flex items-center justify-center text-white mx-auto mb-5 shadow-soft">
          <Lock size={24} />
        </div>
        <h1 className="text-2xl font-extrabold text-brand-ink text-center mb-1">{tr('loginTitle')}</h1>
        <p className="text-brand-slate text-sm text-center mb-6">{tr('loginSubtitle')}</p>

        <label className="block text-xs font-medium text-brand-slate mb-1.5">{tr('username')}</label>
        <input
          type="text"
          value={user}
          autoFocus
          autoComplete="username"
          placeholder="admin"
          onChange={(e) => { setUser(e.target.value); setError(false); }}
          className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-brand-ink focus:border-brand-ink focus:outline-none mb-4"
        />

        <label className="block text-xs font-medium text-brand-slate mb-1.5">{tr('password')}</label>
        <input
          type="password"
          value={pw}
          autoComplete="current-password"
          placeholder="••••••••"
          onChange={(e) => { setPw(e.target.value); setError(false); }}
          className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-brand-ink focus:border-brand-ink focus:outline-none mb-3"
        />

        {error && <p className="text-red-500 text-sm mb-3">{tr('wrongCreds')}</p>}
        <button type="submit" disabled={checking} className="btn-primary w-full disabled:opacity-60">
          {checking ? tr('checking') : tr('signIn')}
        </button>
        <Link to="/" className="block text-center text-sm text-brand-slate hover:text-brand-ink mt-4">
          {tr('backToSite')}
        </Link>
      </form>
    </div>
  );
}

// ---- Requests inbox -------------------------------------------------------

function useSubmissions() {
  const [items, setItems] = useState<Submission[]>(() => loadSubmissions());
  useEffect(() => {
    const refresh = () => setItems(loadSubmissions());
    window.addEventListener(SUBMISSIONS_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(SUBMISSIONS_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);
  return items;
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function RequestsView({ serviceLabel, tr }: { serviceLabel: (id: string) => string; tr: Tr }) {
  const items = useSubmissions();
  const [filter, setFilter] = useState<'all' | 'contact' | 'booking'>('all');

  const filtered = items.filter((s) => filter === 'all' || s.type === filter);
  const counts = {
    all: items.length,
    contact: items.filter((s) => s.type === 'contact').length,
    booking: items.filter((s) => s.type === 'booking').length,
  };

  const exportCsv = () => {
    const rows = [['type', 'date', 'name', 'email', 'detail']];
    for (const s of items) {
      const detail = s.type === 'contact' ? s.message : `${serviceLabel(s.service)} · ${s.date} ${s.time}`;
      rows.push([s.type, new Date(s.createdAt).toISOString(), s.name, s.email, detail]);
    }
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dowletli-requests.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs: { id: 'all' | 'contact' | 'booking'; label: string; n: number }[] = [
    { id: 'all', label: tr('fAll'), n: counts.all },
    { id: 'contact', label: tr('fMessages'), n: counts.contact },
    { id: 'booking', label: tr('fBookings'), n: counts.booking },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-7">
        <div className="flex gap-1 bg-white border border-brand-border rounded-xl p-1">
          {tabs.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setFilter(tb.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                filter === tb.id ? 'bg-brand-ink text-white' : 'text-brand-text hover:text-brand-ink'
              }`}
            >
              {tb.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === tb.id ? 'bg-white/20' : 'bg-brand-soft text-brand-slate'}`}>
                {tb.n}
              </span>
            </button>
          ))}
        </div>
        <div className="sm:ml-auto flex gap-2">
          <button onClick={exportCsv} disabled={!items.length} className="btn-ghost !px-4 !py-2 text-sm disabled:opacity-50">
            <Download size={16} /> {tr('csv')}
          </button>
          <button
            onClick={() => { if (confirm(tr('confirmClearRequests'))) clearSubmissions(); }}
            disabled={!items.length}
            className="btn-ghost !px-4 !py-2 text-sm disabled:opacity-50"
          >
            <Trash2 size={16} /> {tr('clear')}
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-brand-border rounded-2xl">
          <Inbox size={36} className="mx-auto text-brand-slate mb-4" strokeWidth={1.4} />
          <p className="text-brand-ink font-semibold">{tr('noRequests')}</p>
          <p className="text-brand-slate text-sm mt-1 max-w-sm mx-auto">
            {tr('noRequestsBody')}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <div
              key={s.id}
              className={`bg-white border rounded-2xl p-5 transition-colors ${
                s.read ? 'border-brand-border' : 'border-brand-ink/30'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  s.type === 'contact' ? 'bg-brand-soft text-brand-ink' : 'bg-brand-ink text-white'
                }`}>
                  {s.type === 'contact' ? <Mail size={18} /> : <CalendarClock size={18} />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-brand-ink">{s.name || '—'}</span>
                    {!s.read && <span className="w-2 h-2 rounded-full bg-brand-primary" title="Unread" />}
                    <span className="text-xs text-brand-slate ml-auto">{formatDate(s.createdAt)}</span>
                  </div>
                  <a href={`mailto:${s.email}`} className="text-sm text-brand-primary hover:underline break-all">
                    {s.email || '—'}
                  </a>

                  {s.type === 'contact' ? (
                    <p className="text-brand-text mt-2 whitespace-pre-wrap">{s.message}</p>
                  ) : (
                    <div className="mt-2 flex flex-wrap gap-2 text-sm">
                      <span className="px-2.5 py-1 rounded-lg bg-brand-soft text-brand-ink font-medium">{serviceLabel(s.service)}</span>
                      <span className="px-2.5 py-1 rounded-lg bg-brand-soft text-brand-ink font-medium">{s.date}</span>
                      <span className="px-2.5 py-1 rounded-lg bg-brand-soft text-brand-ink font-medium">{s.time}</span>
                    </div>
                  )}

                  <div className="flex gap-4 mt-3 text-sm">
                    <button onClick={() => markRead(s.id, !s.read)} className="text-brand-slate hover:text-brand-ink font-medium">
                      {s.read ? tr('markUnread') : tr('markRead')}
                    </button>
                    <button onClick={() => deleteSubmission(s.id)} className="text-brand-slate hover:text-red-500 font-medium">
                      {tr('delete')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Products manager ------------------------------------------------------

function ProductsManager({ lang, tr }: { lang: Lang; tr: Tr }) {
  const { products, setProducts, resetProducts } = useProducts();

  const patch = (id: string, p: Partial<Product>) =>
    setProducts(products.map((pr) => (pr.id === id ? { ...pr, ...p } : pr)));

  const patchText = (id: string, field: 'title' | 'description', value: string) =>
    setProducts(products.map((pr) =>
      pr.id === id ? { ...pr, t: { ...pr.t, [lang]: { ...pr.t[lang], [field]: value } } } : pr));

  const setSpecs = (id: string, specs: string[]) =>
    setProducts(products.map((pr) =>
      pr.id === id ? { ...pr, t: { ...pr.t, [lang]: { ...pr.t[lang], specs } } } : pr));

  const addProduct = () => setProducts([...products, makeEmptyProduct()]);

  const removeProduct = (id: string) => {
    if (confirm(tr('confirmDeleteProduct'))) {
      setProducts(products.filter((pr) => pr.id !== id));
    }
  };

  const onPickImage = (id: string, file?: File) => {
    if (!file) return;
    if (file.size > 2_000_000) {
      alert(tr('imageTooBig'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => patch(id, { image: String(reader.result) });
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-ink">{tr('productsTitle')}</h1>
          <p className="text-brand-slate text-sm mt-1">
            {tr('productsEditingPre')}
            <span className="font-semibold text-brand-ink">{LANG_LABELS[lang]}</span>
            {tr('productsEditingPost')}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => { if (confirm(tr('confirmResetProducts'))) resetProducts(); }}
            className="btn-ghost !px-3.5 !py-2 text-sm"
          >
            <RotateCcw size={16} /> {tr('reset')}
          </button>
          <button onClick={addProduct} className="btn-primary !px-4 !py-2 text-sm">
            <Plus size={16} /> {tr('addProduct')}
          </button>
        </div>
      </div>

      {products.length === 0 && (
        <div className="text-center py-20 border border-dashed border-brand-border rounded-2xl">
          <Boxes size={36} className="mx-auto text-brand-slate mb-4" strokeWidth={1.4} />
          <p className="text-brand-ink font-semibold">{tr('noProducts')}</p>
          <button onClick={addProduct} className="btn-primary !px-4 !py-2 text-sm mt-4">
            <Plus size={16} /> {tr('addFirstProduct')}
          </button>
        </div>
      )}

      <div className="space-y-5">
        {products.map((p, idx) => {
          const text = p.t[lang] || { title: '', description: '', specs: [] };
          return (
            <div key={p.id} className="bg-white border border-brand-border rounded-2xl p-5 shadow-soft">
              <div className="grid md:grid-cols-[180px_1fr] gap-5">
                {/* Image */}
                <div>
                  <div className="relative aspect-[5/4] rounded-xl overflow-hidden bg-brand-soft border border-brand-border flex items-center justify-center">
                    {p.image ? (
                      <img src={p.image} alt={text.title} className="w-full h-full object-cover" />
                    ) : (
                      <ImagePlus size={26} className="text-brand-slate" strokeWidth={1.5} />
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <label className="flex-1 cursor-pointer text-center text-xs font-semibold py-2 rounded-lg border border-brand-border text-brand-ink hover:bg-brand-soft transition-colors">
                      {p.image ? tr('replace') : tr('upload')}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => onPickImage(p.id, e.target.files?.[0])}
                      />
                    </label>
                    {p.image && (
                      <button
                        onClick={() => patch(p.id, { image: '' })}
                        title="Remove image"
                        className="px-2.5 py-2 rounded-lg border border-brand-border text-brand-slate hover:text-red-500 hover:border-red-200 transition-colors"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Fields */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-mono text-brand-slate mt-1">#{idx + 1}</span>
                    <button
                      onClick={() => removeProduct(p.id)}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-slate hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={15} /> {tr('deleteProduct')}
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-brand-ink mb-1.5">{tr('title')}</label>
                      <input
                        value={text.title}
                        onChange={(e) => patchText(p.id, 'title', e.target.value)}
                        className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-2.5 text-brand-text focus:border-brand-ink focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-brand-ink mb-1.5">{tr('category')}</label>
                      <input
                        value={p.category}
                        onChange={(e) => patch(p.id, { category: e.target.value })}
                        placeholder={tr('categoryPlaceholder')}
                        className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-2.5 text-brand-text focus:border-brand-ink focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-brand-ink mb-1.5">{tr('description')}</label>
                    <textarea
                      value={text.description}
                      rows={2}
                      onChange={(e) => patchText(p.id, 'description', e.target.value)}
                      className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-2.5 text-brand-text focus:border-brand-ink focus:outline-none resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-brand-ink mb-1.5">{tr('specs')}</label>
                    <div className="space-y-2">
                      {text.specs.map((spec, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            value={spec}
                            onChange={(e) => setSpecs(p.id, text.specs.map((s, j) => (j === i ? e.target.value : s)))}
                            className="flex-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-2.5 text-brand-text focus:border-brand-ink focus:outline-none"
                          />
                          <button
                            onClick={() => setSpecs(p.id, text.specs.filter((_, j) => j !== i))}
                            className="p-2.5 rounded-xl border border-brand-border text-brand-slate hover:text-red-500 hover:border-red-200 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => setSpecs(p.id, [...text.specs, ''])}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline"
                      >
                        <Plus size={15} /> {tr('addSpec')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-brand-slate mt-8 max-w-xl mx-auto">
        {tr('productsNote')}
      </p>
    </div>
  );
}

// ---- Language dropdown -----------------------------------------------------

function AdminLangSelect({ value, onChange }: { value: Lang; onChange: (l: Lang) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 bg-white border rounded-xl pl-3 pr-2.5 py-2 text-sm font-semibold text-brand-ink transition-colors ${
          open ? 'border-brand-primary/50 shadow-soft' : 'border-brand-border hover:border-brand-primary/40'
        }`}
      >
        <Globe size={16} className="text-brand-primary" />
        <span>{LANG_LABELS[value]}</span>
        <ChevronDown size={15} className={`text-brand-slate transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-48 p-1.5 bg-white border border-brand-border rounded-2xl shadow-card z-50 origin-top animate-fade-in">
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => { onChange(l); setOpen(false); }}
              className={`flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors ${
                value === l ? 'bg-brand-soft text-brand-primary font-semibold' : 'text-brand-text hover:bg-brand-soft/70'
              }`}
            >
              <span className="w-6 text-center text-xs uppercase text-brand-slate">{l === 'tkm' ? 'TM' : l}</span>
              <span className="flex-1">{LANG_LABELS[l]}</span>
              {value === l && <Check size={15} className="text-brand-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Main ------------------------------------------------------------------

export default function Admin() {
  const navigate = useNavigate();
  const { content, saveContent, resetContent } = useContentStore();
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === '1');
  const [view, setView] = useState<'content' | 'products' | 'requests'>('content');
  const [draft, setDraft] = useState<AllContent>(() => clone(content));
  const [lang, setLang] = useState<Lang>('en');
  const [query, setQuery] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [previewKey, setPreviewKey] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const submissions = useSubmissions();
  const unread = submissions.filter((s) => !s.read).length;

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(content),
    [draft, content],
  );

  // Auto-apply edits so the live preview & site update without pressing Save.
  useEffect(() => {
    if (!dirty) return;
    const id = setTimeout(() => {
      saveContent(JSON.parse(JSON.stringify(draft)));
      setPreviewKey((k) => k + 1);
    }, 600);
    return () => clearTimeout(id);
  }, [draft, dirty, saveContent]);

  const serviceLabel = (id: string): string => {
    const booking = content.en?.booking as unknown as { services?: Record<string, string> } | undefined;
    return (booking?.services && booking.services[id]) || id || '—';
  };

  const tr = adminT(lang);

  if (!authed) return <Login onOk={() => setAuthed(true)} />;

  const update = (p: (string | number)[], v: Json) => {
    setDraft((d) => ({ ...d, [lang]: setByPath(d[lang], p, v) }));
  };

  const handleSave = () => {
    saveContent(clone(draft));
    setSavedFlash(true);
    setPreviewKey((k) => k + 1); // refresh live preview
    setTimeout(() => setSavedFlash(false), 2000);
  };

  const handleReset = () => {
    if (!confirm(tr('confirmResetContent'))) return;
    const defaults = resetContent();
    setDraft(clone(defaults));
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dowletli-content.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const next = clone(draft);
        for (const l of LANGS) if (parsed[l]) next[l] = parsed[l];
        setDraft(next);
        alert(tr('imported'));
      } catch {
        alert(tr('importError'));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
    navigate('/');
  };

  const sections = Object.entries(draft[lang]);

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-lg border-b border-brand-border">
        <div className="container mx-auto px-6 py-3 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3 mr-2">
            <img src="/assets/logo.png" alt="logo" className="h-9 w-9 object-contain" />
            <div className="hidden sm:block">
              <div className="font-extrabold text-brand-ink leading-tight">{tr('adminTitle')}</div>
              <div className="text-xs text-brand-slate">{tr('adminSubtitle')}</div>
            </div>
          </div>

          {/* View tabs */}
          <nav className="flex gap-1 bg-brand-soft rounded-xl p-1">
            <button
              onClick={() => setView('content')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${
                view === 'content' ? 'bg-white text-brand-ink shadow-soft' : 'text-brand-slate hover:text-brand-ink'
              }`}
            >
              <FileText size={16} /> {tr('tabContent')}
            </button>
            <button
              onClick={() => setView('products')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${
                view === 'products' ? 'bg-white text-brand-ink shadow-soft' : 'text-brand-slate hover:text-brand-ink'
              }`}
            >
              <Boxes size={16} /> {tr('tabProducts')}
            </button>
            <button
              onClick={() => setView('requests')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${
                view === 'requests' ? 'bg-white text-brand-ink shadow-soft' : 'text-brand-slate hover:text-brand-ink'
              }`}
            >
              <Inbox size={16} /> {tr('tabRequests')}
              {unread > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-brand-primary text-white">{unread}</span>
              )}
            </button>
          </nav>

          {/* Language dropdown — used by Content & Products */}
          {view !== 'requests' && <AdminLangSelect value={lang} onChange={setLang} />}

          <div className="flex items-center gap-2 ml-auto">
            <Link to="/" target="_blank" className="btn-ghost !px-3.5 !py-2 text-sm">
              <ExternalLink size={16} /> <span className="hidden md:inline">{tr('viewSite')}</span>
            </Link>
            <button onClick={logout} className="btn-ghost !px-3.5 !py-2 text-sm">
              <LogOut size={16} /> <span className="hidden md:inline">{tr('logout')}</span>
            </button>
            {view === 'content' && (
              <button
                onClick={handleSave}
                disabled={!dirty}
                className="btn-primary !px-5 !py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savedFlash ? <Check size={16} /> : <Save size={16} />}
                {savedFlash ? tr('saved') : tr('save')}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="px-4 md:px-6 py-8 max-w-[1540px] mx-auto">
        {view === 'requests' ? (
          <div className="max-w-5xl mx-auto">
            <div className="mb-7">
              <h1 className="text-2xl font-extrabold text-brand-ink">{tr('requestsTitle')}</h1>
              <p className="text-brand-slate text-sm mt-1">{tr('requestsSubtitle')}</p>
            </div>
            <RequestsView serviceLabel={serviceLabel} tr={tr} />
            <p className="text-center text-xs text-brand-slate mt-10 max-w-xl mx-auto">
              {tr('requestsNote')}
            </p>
          </div>
        ) : view === 'products' ? (
          <ProductsManager lang={lang} tr={tr} />
        ) : (
          <>
            {/* How-to banner */}
            <div className="mb-6 flex items-start gap-3 rounded-2xl bg-white border border-brand-border p-4 shadow-soft">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-primary to-brand-cyan text-white flex items-center justify-center shrink-0">
                <MonitorSmartphone size={18} />
              </div>
              <p className="text-sm text-brand-text">
                <span className="font-semibold text-brand-ink">{tr('howTitle')}</span> {tr('howBody')}
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={tr('searchPlaceholder')}
                  className="w-full bg-white border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-brand-text focus:border-brand-ink focus:outline-none"
                />
              </div>

              <div className="flex gap-2 md:ml-auto">
                <button
                  onClick={() => setShowPreview((v) => !v)}
                  className="btn-ghost !px-3.5 !py-2 text-sm hidden lg:inline-flex"
                >
                  {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                  {showPreview ? tr('hidePreview') : tr('showPreview')}
                </button>
                <button onClick={handleExport} className="btn-ghost !px-3.5 !py-2 text-sm">
                  <Download size={16} /> {tr('export')}
                </button>
                <button onClick={() => fileRef.current?.click()} className="btn-ghost !px-3.5 !py-2 text-sm">
                  <Upload size={16} /> {tr('import')}
                </button>
                <input ref={fileRef} type="file" accept="application/json" onChange={handleImport} className="hidden" />
                <button onClick={handleReset} className="btn-ghost !px-3.5 !py-2 text-sm">
                  <RotateCcw size={16} /> {tr('reset')}
                </button>
              </div>
            </div>

            {dirty && (
              <div className="mb-5 flex items-center gap-2 text-sm font-medium text-brand-primary bg-brand-soft border border-brand-primary/20 px-4 py-2.5 rounded-xl">
                <RefreshCw size={15} className="animate-spin" /> {tr('applying')}
              </div>
            )}

            <div className={showPreview ? 'grid lg:grid-cols-2 gap-6 items-start' : ''}>
              {/* Editor */}
              <div className="grid gap-5">
                {sections.map(([key, value]) => {
                  // Product items (with images) are managed in the Products tab.
                  let v = value;
                  if (key === 'products' && value && typeof value === 'object' && !Array.isArray(value)) {
                    const copy = { ...(value as Record<string, Json>) };
                    delete copy.items;
                    v = copy;
                  }
                  return (
                    <NodeEditor
                      key={key}
                      value={v}
                      path={[key]}
                      onChange={(p, val) => update(p, val)}
                      query={query.trim().toLowerCase()}
                      depth={0}
                      tr={tr}
                      lang={lang}
                    />
                  );
                })}
                <p className="text-center text-xs text-brand-slate mt-4">
                  {tr('contentNote')}
                </p>
              </div>

              {/* Live preview */}
              {showPreview && (
                <div className="hidden lg:block lg:sticky lg:top-24">
                  <div className="rounded-2xl border border-brand-border bg-white shadow-card overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-brand-border bg-brand-soft/50">
                      <span className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-300" />
                        <span className="w-3 h-3 rounded-full bg-amber-300" />
                        <span className="w-3 h-3 rounded-full bg-green-300" />
                      </span>
                      <span className="text-xs font-medium text-brand-slate ml-2">
                        {tr('livePreview')} · {LANG_LABELS[lang]}
                      </span>
                      <div className="ml-auto flex items-center gap-1">
                        <button
                          onClick={() => setPreviewKey((k) => k + 1)}
                          title="Refresh preview"
                          className="p-1.5 rounded-lg text-brand-slate hover:text-brand-ink hover:bg-white transition-colors"
                        >
                          <RefreshCw size={15} />
                        </button>
                        <Link
                          to={`/?lang=${lang}`}
                          target="_blank"
                          title="Open in new tab"
                          className="p-1.5 rounded-lg text-brand-slate hover:text-brand-ink hover:bg-white transition-colors"
                        >
                          <ExternalLink size={15} />
                        </Link>
                      </div>
                    </div>
                    <iframe
                      key={`${previewKey}-${lang}`}
                      src={`/?lang=${lang}`}
                      title="Live preview"
                      className="w-full h-[calc(100vh-11rem)] bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
