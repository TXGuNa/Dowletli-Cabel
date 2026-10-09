// Small shared building blocks for the admin panel.

import { useState, type ReactNode, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { Check, ImagePlus, Images, Upload as UploadIcon, X, RotateCcw } from 'lucide-react';
import type { GalleryImage } from '../content/galleryStore';
import { readImageFile } from './images';
import type { Tr } from './types';

export const inputCls =
  'w-full bg-white border border-brand-border rounded-xl px-3.5 py-2.5 text-[15px] text-brand-ink placeholder:text-brand-slate/70 ' +
  'focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:outline-none transition-shadow';

export function Card({
  title, subtitle, icon, actions, children, className = '', id,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`bg-white border border-brand-border rounded-2xl shadow-[0_1px_2px_rgba(14,22,38,0.04)] ${className}`}>
      {(title || actions) && (
        <header className="flex items-start gap-3 px-5 pt-5 pb-1">
          {icon && (
            <span className="w-9 h-9 rounded-xl bg-brand-soft text-brand-primary flex items-center justify-center shrink-0">
              {icon}
            </span>
          )}
          <div className="min-w-0 flex-1">
            {title && <h3 className="text-[15px] font-bold text-brand-ink leading-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-brand-slate mt-1 leading-relaxed">{subtitle}</p>}
          </div>
          {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function FieldLabel({ children, hint }: { children: ReactNode; hint?: ReactNode }) {
  return (
    <div className="mb-1.5">
      <label className="block text-[13px] font-semibold text-brand-ink">{children}</label>
      {hint && <p className="text-xs text-brand-slate mt-0.5">{hint}</p>}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className || ''}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputCls} resize-y ${props.className || ''}`} />;
}

export function Toggle({
  checked, onChange, label, hint, testId,
}: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode; hint?: ReactNode; testId?: string }) {
  return (
    <label className="flex items-start gap-3 py-2 cursor-pointer select-none group">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        data-testid={testId}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 w-10 h-6 rounded-full shrink-0 transition-colors ${
          checked ? 'bg-brand-primary' : 'bg-slate-300 group-hover:bg-slate-400'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-4' : ''
          }`}
        />
      </button>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-brand-ink">{label}</span>
        {hint && <span className="block text-xs text-brand-slate mt-0.5">{hint}</span>}
      </span>
    </label>
  );
}

export function Segmented<T extends string>({
  options, value, onChange, size = 'md',
}: {
  options: { value: T; label: ReactNode; icon?: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  size?: 'sm' | 'md';
}) {
  return (
    <div className="inline-flex bg-brand-soft rounded-xl p-1 gap-1 max-w-full overflow-x-auto no-scrollbar">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg font-semibold transition-colors ${
            size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm'
          } ${value === o.value ? 'bg-white text-brand-ink shadow-sm' : 'text-brand-slate hover:text-brand-ink'}`}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  );
}

// Choose an image from the gallery OR upload a file.
export function ImagePicker({
  value, onChange, gallery, tr, allowRemove, aspect = 'aspect-[5/4]', contain, maxDimension, testId,
}: {
  value: string;
  onChange: (img: string) => void;
  gallery: GalleryImage[];
  tr: Tr;
  allowRemove?: boolean;
  aspect?: string;
  contain?: boolean;
  maxDimension?: number;
  testId?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div data-testid={testId}>
      <div className={`relative ${aspect} rounded-xl overflow-hidden bg-brand-soft border border-brand-border flex items-center justify-center`}>
        {value ? (
          <img src={value} alt="" className={`w-full h-full ${contain ? 'object-contain p-3' : 'object-cover'}`} />
        ) : (
          <ImagePlus size={26} className="text-brand-slate" strokeWidth={1.5} />
        )}
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        <label className="flex-1 min-w-[90px] cursor-pointer text-center text-xs font-semibold py-2 rounded-lg border border-brand-border text-brand-ink hover:bg-brand-soft transition-colors inline-flex items-center justify-center gap-1.5">
          <UploadIcon size={13} /> {value ? tr('replace') : tr('upload')}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              readImageFile(e.target.files?.[0], tr('imageTooBig'), onChange, maxDimension);
              e.target.value = '';
            }}
          />
        </label>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`flex-1 min-w-[90px] text-center text-xs font-semibold py-2 rounded-lg border transition-colors inline-flex items-center justify-center gap-1.5 ${
            open ? 'border-brand-primary/50 text-brand-primary bg-brand-soft' : 'border-brand-border text-brand-ink hover:bg-brand-soft'
          }`}
        >
          <Images size={13} /> {tr('fromGallery')}
        </button>
        {allowRemove && value && (
          <button
            type="button"
            onClick={() => onChange('')}
            title={tr('remove')}
            className="px-2.5 py-2 rounded-lg border border-brand-border text-brand-slate hover:text-red-500 hover:border-red-200 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && (
        <div className="mt-2 p-2 rounded-xl border border-brand-border bg-white max-h-52 overflow-y-auto">
          {gallery.filter((g) => g.image).length === 0 ? (
            <p className="text-xs text-brand-slate text-center py-4">{tr('noGalleryYet')}</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {gallery.filter((g) => g.image).map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => { onChange(g.image); setOpen(false); }}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    value === g.image ? 'border-brand-primary' : 'border-transparent hover:border-brand-primary/40'
                  }`}
                >
                  <img src={g.image} alt="" className="w-full h-full object-cover" />
                  {value === g.image && (
                    <span className="absolute top-1 right-1 bg-brand-primary text-white rounded-full p-0.5">
                      <Check size={11} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Color picker with hex text input and an optional "use theme value" reset.
export function ColorField({
  label, value, fallback, onChange, onReset, resetLabel, testId,
}: {
  label: ReactNode;
  value?: string;
  fallback: string;
  onChange: (hex: string) => void;
  onReset: () => void;
  resetLabel: string;
  testId?: string;
}) {
  const shown = value || fallback;
  const [text, setText] = useState(shown);
  const [lastShown, setLastShown] = useState(shown);
  if (shown !== lastShown) {
    setLastShown(shown);
    setText(shown);
  }
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center gap-2">
        <label className="relative w-11 h-11 rounded-xl border border-brand-border overflow-hidden cursor-pointer shrink-0" style={{ background: shown }}>
          <input
            type="color"
            value={shown}
            data-testid={testId}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) onChange(e.target.value.toUpperCase());
          }}
          className={`${inputCls} font-mono uppercase !py-2`}
          maxLength={7}
        />
        <button
          type="button"
          onClick={onReset}
          disabled={!value}
          title={resetLabel}
          className="p-2.5 rounded-xl border border-brand-border text-brand-slate hover:text-brand-ink disabled:opacity-40 shrink-0"
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </div>
  );
}

export function Pill({ children, tone = 'slate' }: { children: ReactNode; tone?: 'slate' | 'blue' | 'green' | 'amber' | 'dark' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-600',
    blue: 'bg-brand-soft text-brand-primary',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    dark: 'bg-brand-ink text-white',
  } as const;
  return <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${tones[tone]}`}>{children}</span>;
}
