// Editors for the translatable site texts (the locale JSON tree).
// Can show one language, or all three side by side.

import { Plus, Trash2 } from 'lucide-react';
import type { Json, LangContent } from '../content/contentStore';
import type { Lang } from '../content/detectLanguage';
import { fieldLabel, sectionLabel } from '../content/adminStrings';
import { inputCls } from './ui';
import { getByPath, getString, matches, HIDDEN_KEYS, HIDDEN_PATHS, type Path } from './contentPaths';
import type { Tr } from './types';

const LANG_TAG: Record<Lang, string> = { en: 'EN', ru: 'RU', tkm: 'TM' };

export interface EditorCtx {
  langs: Lang[];               // languages to show (1 or 3)
  uiLang: Lang;                // language for labels
  data: Record<Lang, LangContent>;
  onChange: (lang: Lang, path: Path, value: Json) => void;
  onFocusField?: (path: Path, value: string, lang: Lang) => void;
  query: string;
  tr: Tr;
}

function LangColumns({ ctx, render }: { ctx: EditorCtx; render: (lang: Lang) => React.ReactNode }) {
  if (ctx.langs.length === 1) return <>{render(ctx.langs[0])}</>;
  return (
    <div className="grid gap-2 lg:grid-cols-3">
      {ctx.langs.map((l) => (
        <div key={l} className="relative">
          <span className="absolute -top-2 left-2.5 z-10 px-1.5 text-[10px] font-bold tracking-wider text-brand-slate bg-white rounded">
            {LANG_TAG[l]}
          </span>
          {render(l)}
        </div>
      ))}
    </div>
  );
}

function StringField({ path, ctx }: { path: Path; ctx: EditorCtx }) {
  const label = fieldLabel(String(path[path.length - 1]), ctx.uiLang);
  const longest = Math.max(...ctx.langs.map((l) => getString(ctx.data[l], path).length));
  const long = longest > 60;
  return (
    <div data-field={path.join('.')}>
      <label className="block text-[13px] font-semibold text-brand-ink mb-1.5">{label}</label>
      <LangColumns
        ctx={ctx}
        render={(l) => {
          const value = getString(ctx.data[l], path);
          const common = {
            value,
            lang: l === 'tkm' ? 'tk' : l,
            'data-lang': l,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => ctx.onChange(l, path, e.target.value),
            onFocus: () => ctx.onFocusField?.(path, value, l),
          };
          return long ? (
            <textarea {...common} rows={Math.min(6, Math.ceil(longest / 55))} className={`${inputCls} resize-y`} />
          ) : (
            <input {...common} className={inputCls} />
          );
        }}
      />
    </div>
  );
}

function ArrayField({ path, ctx }: { path: Path; ctx: EditorCtx }) {
  const label = fieldLabel(String(path[path.length - 1]), ctx.uiLang);
  return (
    <div data-field={path.join('.')}>
      <label className="block text-[13px] font-semibold text-brand-ink mb-1.5">{label}</label>
      <LangColumns
        ctx={ctx}
        render={(l) => {
          const raw = getByPath(ctx.data[l], path);
          const list = Array.isArray(raw) ? raw.map((x) => String(x ?? '')) : [];
          return (
            <div className="space-y-2">
              {list.map((item, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <input
                    value={item}
                    lang={l === 'tkm' ? 'tk' : l}
                    onChange={(e) => ctx.onChange(l, [...path, i], e.target.value)}
                    onFocus={() => ctx.onFocusField?.([...path, i], item, l)}
                    className={`${inputCls} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => ctx.onChange(l, path, list.filter((_, j) => j !== i))}
                    className="p-2.5 rounded-xl border border-brand-border text-brand-slate hover:text-red-500 hover:border-red-200 transition-colors"
                    title={ctx.tr('remove')}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => ctx.onChange(l, path, [...list, ''])}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:underline"
              >
                <Plus size={15} /> {ctx.tr('addItem')}
              </button>
            </div>
          );
        }}
      />
    </div>
  );
}

// Walks the structure of the first language; each leaf renders all languages.
export function NodeEditor({ path, ctx, depth }: { path: Path; ctx: EditorCtx; depth: number }) {
  const base = ctx.langs[0];
  const value = getByPath(ctx.data[base], path);
  const anyMatch = (p: Path) => ctx.langs.some((l) => matches(getByPath(ctx.data[l], p), p, ctx.query));

  if (typeof value === 'string') {
    if (!anyMatch(path)) return null;
    return <StringField path={path} ctx={ctx} />;
  }
  if (Array.isArray(value)) {
    if (!value.every((v) => typeof v === 'string')) return null;
    if (!anyMatch(path)) return null;
    return <ArrayField path={path} ctx={ctx} />;
  }
  if (value && typeof value === 'object') {
    const hidden = depth === 0 ? HIDDEN_KEYS[String(path[0])] || [] : [];
    const keys = Object.keys(value).filter(
      (k) => !hidden.includes(k) && !HIDDEN_PATHS.has([...path, k].join('.')) && anyMatch([...path, k]),
    );
    if (keys.length === 0) return null;
    const wide = ctx.langs.length > 1;
    const grid = wide ? 'grid gap-4' : 'grid sm:grid-cols-2 gap-4';
    const span = (k: string) => {
      const v = (value as Record<string, Json>)[k];
      if (wide) return '';
      const isGroup = v && typeof v === 'object' && !Array.isArray(v);
      const isLong = typeof v === 'string' && v.length > 60;
      return isGroup || isLong || Array.isArray(v) ? 'sm:col-span-2' : '';
    };

    if (depth === 0) {
      return (
        <section className="bg-white border border-brand-border rounded-2xl p-5" data-section={String(path[0])}>
          <h3 className="text-[15px] font-bold text-brand-ink mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-brand-primary" />
            {sectionLabel(String(path[path.length - 1]), ctx.uiLang)}
          </h3>
          <div className={grid}>
            {keys.map((k) => (
              <div key={k} className={span(k)}>
                <NodeEditor path={[...path, k]} ctx={ctx} depth={depth + 1} />
              </div>
            ))}
          </div>
        </section>
      );
    }

    return (
      <div className="rounded-xl border border-brand-border/80 bg-brand-bg/50 p-4">
        <div className="text-[13px] font-bold text-brand-ink mb-3">{fieldLabel(String(path[path.length - 1]), ctx.uiLang)}</div>
        <div className={grid}>
          {keys.map((k) => (
            <div key={k} className={span(k)}>
              <NodeEditor path={[...path, k]} ctx={ctx} depth={depth + 1} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}
