// Products manager: add / remove products, their photos, category and texts.

import { useMemo, useState } from 'react';
import { Boxes, Check, Info, Plus, RotateCcw, Trash2, X } from 'lucide-react';
import { LANGS, LANG_LABELS } from '../content/contentStore';
import type { Lang } from '../content/detectLanguage';
import { fieldLabel, categoryHint } from '../content/adminStrings';
import { type Product, makeEmptyProduct, defaultProducts, DEFAULT_CATEGORIES } from '../content/productsStore';
import type { GalleryImage } from '../content/galleryStore';
import { ImagePicker } from './ui';
import type { Tr } from './types';

// ---- Category picker (existing categories + add-your-own) ------------------

function CategorySelect({
  value, onChange, options, lang, tr,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  lang: Lang;
  tr: Tr;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');

  const label = (key: string) =>
    (DEFAULT_CATEGORIES as readonly string[]).includes(key) ? fieldLabel(key, lang) : key;

  const confirm = () => {
    const v = draft.trim();
    if (v) onChange(v);
    setDraft('');
    setAdding(false);
  };

  if (adding) {
    return (
      <div className="flex gap-2">
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); confirm(); }
            if (e.key === 'Escape') { setDraft(''); setAdding(false); }
          }}
          placeholder={tr('newCategoryPlaceholder')}
          className="flex-1 bg-white border border-brand-primary/50 rounded-xl px-3.5 py-2.5 text-brand-ink focus:outline-none"
        />
        <button
          type="button" onClick={confirm} title={tr('addNewCategory')}
          className="px-3 rounded-xl border border-brand-border text-brand-primary hover:bg-brand-soft transition-colors"
        >
          <Check size={16} />
        </button>
        <button
          type="button" onClick={() => { setDraft(''); setAdding(false); }} title={tr('remove')}
          className="px-3 rounded-xl border border-brand-border text-brand-slate hover:text-red-500 hover:border-red-200 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <select
      value={value}
      onChange={(e) => {
        if (e.target.value === '__add__') setAdding(true);
        else onChange(e.target.value);
      }}
      className="w-full bg-white border border-brand-border rounded-xl px-3.5 py-2.5 text-brand-ink focus:border-brand-primary focus:outline-none"
    >
      <option value="">{tr('selectCategory')}</option>
      {options.map((c) => (
        <option key={c} value={c}>{label(c)}</option>
      ))}
      <option value="__add__">＋ {tr('addNewCategory')}</option>
    </select>
  );
}

// ---- Products manager ------------------------------------------------------

export default function ProductsView({
  products, setProducts, gallery, lang, uiLang, tr,
}: {
  products: Product[];
  setProducts: (next: Product[]) => void;
  gallery: GalleryImage[];
  lang: Lang;
  uiLang: Lang;
  tr: Tr;
}) {
  const resetProducts = () => setProducts(defaultProducts());

  // Categories offered in the dropdown: the built-in ones + any already used
  // by a product (so a new category added on one product appears on the others).
  const allCategories = useMemo(() => {
    const set = new Set<string>(DEFAULT_CATEGORIES);
    for (const pr of products) if (pr.category.trim()) set.add(pr.category.trim());
    return Array.from(set);
  }, [products]);

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

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-brand-slate text-sm">
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
            <div key={p.id} className="bg-white border border-brand-border rounded-2xl p-5" data-testid="product-card">
              <div className="grid md:grid-cols-[180px_1fr] gap-5">
                {/* Image */}
                <ImagePicker
                  value={p.image}
                  onChange={(img) => patch(p.id, { image: img })}
                  gallery={gallery}
                  tr={tr}
                  allowRemove
                  testId="product-image"
                />

                {/* Fields */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-mono text-brand-slate mr-1">#{idx + 1}</span>
                      {LANGS.map((l) => {
                        const ok = !!p.t[l]?.title?.trim();
                        return (
                          <span
                            key={l}
                            title={ok ? undefined : tr('missingTranslation')}
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${ok ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}
                          >
                            {l === 'tkm' ? 'TM' : l.toUpperCase()} {ok ? '✓' : '!'}
                          </span>
                        );
                      })}
                    </span>
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
                        className="w-full bg-white border border-brand-border rounded-xl px-3.5 py-2.5 text-brand-ink focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:outline-none"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <label className="text-sm font-semibold text-brand-ink">{tr('category')}</label>
                        <span className="relative group inline-flex">
                          <Info size={14} className="text-brand-slate cursor-help" />
                          <div className="pointer-events-none absolute left-0 top-full mt-2 w-72 max-w-[80vw] opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-30 bg-brand-ink text-white text-xs rounded-xl p-3 shadow-card space-y-2">
                            <p className="text-white/70">{tr('categoryHelp')}</p>
                            {DEFAULT_CATEGORIES.map((c) => (
                              <div key={c}>
                                <span className="font-semibold">{fieldLabel(c, uiLang)}</span>
                                <span className="text-white/80"> — {categoryHint(c, uiLang)}</span>
                              </div>
                            ))}
                          </div>
                        </span>
                      </div>
                      <CategorySelect
                        value={p.category}
                        onChange={(v) => patch(p.id, { category: v })}
                        options={allCategories}
                        lang={uiLang}
                        tr={tr}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-brand-ink mb-1.5">{tr('description')}</label>
                    <textarea
                      value={text.description}
                      rows={2}
                      onChange={(e) => patchText(p.id, 'description', e.target.value)}
                      className="w-full bg-white border border-brand-border rounded-xl px-3.5 py-2.5 text-brand-ink focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:outline-none resize-y"
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
                            className="flex-1 bg-white border border-brand-border rounded-xl px-3.5 py-2.5 text-brand-ink focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:outline-none"
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

