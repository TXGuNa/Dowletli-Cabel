// Gallery manager: photos shown on the Gallery page (and offered in every image picker).

import { Eye, EyeOff, ImagePlus, Images, Plus, RotateCcw, Trash2 } from 'lucide-react';
import type { Lang } from '../content/detectLanguage';
import { fieldLabel } from '../content/adminStrings';
import { type GalleryImage, GALLERY_CATEGORIES, makeEmptyImage, defaultGallery } from '../content/galleryStore';
import { readImageFile } from './images';
import type { Tr } from './types';

// ---- Gallery manager -------------------------------------------------------

export default function GalleryView({
  images, setImages, uiLang, tr,
}: {
  images: GalleryImage[];
  setImages: (next: GalleryImage[]) => void;
  uiLang: Lang;
  tr: Tr;
}) {
  const resetImages = () => setImages(defaultGallery());

  const patchImg = (id: string, p: Partial<GalleryImage>) =>
    setImages(images.map((g) => (g.id === id ? { ...g, ...p } : g)));
  const addImg = () => setImages([...images, makeEmptyImage()]);
  const removeImg = (id: string) => {
    if (confirm(tr('confirmDeleteImage'))) setImages(images.filter((g) => g.id !== id));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-brand-slate text-sm">{tr('gallerySubtitle')}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => { if (confirm(tr('confirmResetGallery'))) resetImages(); }}
            className="btn-ghost !px-3.5 !py-2 text-sm"
          >
            <RotateCcw size={16} /> {tr('reset')}
          </button>
          <button onClick={addImg} className="btn-primary !px-4 !py-2 text-sm">
            <Plus size={16} /> {tr('addImage')}
          </button>
        </div>
      </div>

      {/* Gallery grid */}
      {images.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-brand-border rounded-2xl">
          <Images size={36} className="mx-auto text-brand-slate mb-4" strokeWidth={1.4} />
          <p className="text-brand-ink font-semibold">{tr('noImages')}</p>
          <button onClick={addImg} className="btn-primary !px-4 !py-2 text-sm mt-4">
            <Plus size={16} /> {tr('addFirstImage')}
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((g) => (
            <div key={g.id} className="bg-white border border-brand-border rounded-2xl p-3" data-testid="gallery-card">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-brand-soft border border-brand-border flex items-center justify-center">
                {g.image ? (
                  <img src={g.image} alt="" className={`w-full h-full object-cover transition-opacity ${g.hidden ? 'opacity-40' : ''}`} />
                ) : (
                  <ImagePlus size={24} className="text-brand-slate" strokeWidth={1.5} />
                )}

                {/* Show / hide on the public Gallery page */}
                {g.image && (
                  <button
                    onClick={() => patchImg(g.id, { hidden: !g.hidden })}
                    title={g.hidden ? tr('showInGallery') : tr('hideFromGallery')}
                    className={`absolute top-2 left-2 rounded-lg p-1.5 border transition-colors ${
                      g.hidden
                        ? 'bg-brand-ink text-white border-brand-ink'
                        : 'bg-white/90 text-brand-slate hover:text-brand-ink border-brand-border'
                    }`}
                  >
                    {g.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                )}

                {g.hidden && g.image && (
                  <span className="absolute inset-x-0 bottom-2 mx-auto w-max px-2.5 py-1 rounded-full bg-brand-ink/85 text-white text-[11px] font-semibold inline-flex items-center gap-1">
                    <EyeOff size={12} /> {tr('hiddenLabel')}
                  </span>
                )}

                <button
                  onClick={() => removeImg(g.id)}
                  title={tr('remove')}
                  className="absolute top-2 right-2 bg-white/90 backdrop-blur text-brand-slate hover:text-red-500 rounded-lg p-1.5 border border-brand-border"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <label className="block w-full cursor-pointer text-center text-xs font-semibold py-2 mt-2 rounded-lg border border-brand-border text-brand-ink hover:bg-brand-soft transition-colors">
                {g.image ? tr('replace') : tr('upload')}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    readImageFile(e.target.files?.[0], tr('imageTooBig'), (d) => patchImg(g.id, { image: d }));
                    e.target.value = '';
                  }}
                />
              </label>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {GALLERY_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => patchImg(g.id, { category: c })}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
                      g.category === c
                        ? 'bg-brand-ink text-white border-brand-ink'
                        : 'bg-white text-brand-slate border-brand-border hover:border-brand-primary/40'
                    }`}
                  >
                    {fieldLabel(c, uiLang)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-center text-xs text-brand-slate mt-8 max-w-xl mx-auto">{tr('galleryNote')}</p>
    </div>
  );
}

