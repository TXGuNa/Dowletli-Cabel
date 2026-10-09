// Settings: brand, admin login, backup / restore, reset everything.

import { useRef } from 'react';
import { Archive, Download, RotateCcw, Tag, Upload } from 'lucide-react';
import { mergeContent } from '../content/contentStore';
import { normalizeProducts, defaultProducts } from '../content/productsStore';
import { normalizeGallery, defaultGallery } from '../content/galleryStore';
import { normalizeSettings, defaultSettings, DEFAULT_SETTINGS } from '../content/settingsStore';
import AccountCard from './AccountCard';
import { Card, FieldLabel, ImagePicker, TextInput } from './ui';
import type { Draft, Tr, Updater } from './types';

export default function SettingsView({
  draft, update, tr, defaults, onAuthError,
}: {
  draft: Draft;
  update: Updater;
  tr: Tr;
  defaults: Draft['content'];
  onAuthError: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const download = () => {
    const blob = new Blob([JSON.stringify({ version: 2, exportedAt: new Date().toISOString(), ...draft }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dowletli-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const restore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        // Full backup (v2) or the old texts-only export ({en, ru, tkm}).
        const isObj = (v: unknown) => !!v && typeof v === 'object' && !Array.isArray(v);
        const isFull = isObj(data) && isObj(data.content);
        const texts = isFull ? data.content : data;
        if (!isObj(texts) || !['en', 'ru', 'tkm'].some((l) => isObj(texts[l]))) {
          alert(tr('notBackup'));
          return;
        }
        if (!confirm(tr('confirmRestore'))) return;
        update((d) => ({
          content: mergeContent(isFull ? data.content : data),
          products: isFull && data.products ? normalizeProducts(data.products) : d.products,
          gallery: isFull && data.gallery ? normalizeGallery(data.gallery) : d.gallery,
          settings: isFull && data.settings ? normalizeSettings(data.settings) : d.settings,
        }));
        alert(tr('restored'));
      } catch {
        alert(tr('importError'));
      }
    };
    reader.readAsText(file);
  };

  const resetAll = () => {
    if (!confirm(tr('confirmResetAll'))) return;
    update(() => ({
      content: JSON.parse(JSON.stringify(defaults)),
      products: defaultProducts(),
      gallery: defaultGallery(),
      settings: { ...defaultSettings(), socials: draft.settings.socials },
    }));
  };

  return (
    <div className="grid gap-5 max-w-4xl">
      <Card title={tr('brandSection')} icon={<Tag size={17} />}>
        <div className="grid sm:grid-cols-[1fr_160px] gap-5 items-start">
          <div>
            <FieldLabel hint={tr('brandNameHint')}>{tr('brandName')}</FieldLabel>
            <TextInput
              value={draft.settings.brandName}
              onChange={(e) => update((d) => ({ ...d, settings: { ...d.settings, brandName: e.target.value } }))}
              onBlur={() => {
                if (!draft.settings.brandName.trim()) {
                  update((d) => ({ ...d, settings: { ...d.settings, brandName: DEFAULT_SETTINGS.brandName } }));
                }
              }}
              className="font-semibold"
            />
          </div>
          <div>
            <FieldLabel>{tr('logo')}</FieldLabel>
            <ImagePicker
              value={draft.settings.logoImage}
              onChange={(img) => update((d) => ({ ...d, settings: { ...d.settings, logoImage: img } }))}
              gallery={draft.gallery}
              tr={tr}
              contain
              aspect="aspect-square"
              maxDimension={512}
            />
          </div>
        </div>
      </Card>

      <AccountCard tr={tr} onAuthError={onAuthError} />

      <Card title={tr('backupTitle')} subtitle={tr('backupHint')} icon={<Archive size={17} />}>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={download} data-testid="backup-download" className="btn-ghost !px-4 !py-2.5 text-sm">
            <Download size={16} /> {tr('downloadBackup')}
          </button>
          <button type="button" onClick={() => fileRef.current?.click()} className="btn-ghost !px-4 !py-2.5 text-sm">
            <Upload size={16} /> {tr('restoreBackup')}
          </button>
          <input ref={fileRef} type="file" accept="application/json" onChange={restore} className="hidden" data-testid="backup-file" />
        </div>
      </Card>

      <Card title={tr('resetAllTitle')} subtitle={tr('resetAllHint')} icon={<RotateCcw size={17} />}>
        <button
          type="button"
          onClick={resetAll}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-red-200 text-red-600 hover:bg-red-50"
        >
          <RotateCcw size={16} /> {tr('resetAllTitle')}
        </button>
      </Card>
    </div>
  );
}
