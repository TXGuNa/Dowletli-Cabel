// Image helpers for the admin panel.
//
// A picked file is kept as a data URL in the draft (so the live preview shows
// it right away) and uploaded to the server when the admin presses Publish.
// Large photos are resized in the browser first so the site stays fast.

import { uploadImage } from '../content/api';
import type { Product } from '../content/productsStore';
import type { GalleryImage } from '../content/galleryStore';
import type { SiteSettings } from '../content/settingsStore';

const MAX_INPUT_BYTES = 20_000_000;   // what the admin may pick
const MAX_STORED_BYTES = 9_000_000;   // what we send (server limit is 10 MB)
const MAX_DIMENSION = 2000;           // px, longest side

function dataUrlBytes(dataUrl: string): number {
  const comma = dataUrl.indexOf(',');
  return Math.floor(((dataUrl.length - comma - 1) * 3) / 4);
}

function readAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function prepareImage(file: File, maxDimension = MAX_DIMENSION): Promise<string> {
  if (file.size > MAX_INPUT_BYTES) throw new Error('too_big');
  const original = await readAsDataUrl(file);
  // Vector / animated images are kept as they are.
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    if (file.size > MAX_STORED_BYTES) throw new Error('too_big');
    return original;
  }
  let img: HTMLImageElement;
  try {
    img = await loadImage(original);
  } catch {
    if (file.size > MAX_STORED_BYTES) throw new Error('too_big');
    return original;
  }
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const scale = Math.min(1, maxDimension / Math.max(w, h, 1));
  if (scale === 1 && file.size <= 1_500_000) return original;

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(w * scale));
  canvas.height = Math.max(1, Math.round(h * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) return original;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  // JPEG stays JPEG; everything else -> WebP (keeps transparency). Browsers that
  // can't encode WebP return PNG, which is fine too.
  const type = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/webp';
  let out = canvas.toDataURL(type, 0.85);
  if (scale === 1 && out.length > original.length) out = original;
  if (dataUrlBytes(out) > MAX_STORED_BYTES) throw new Error('too_big');
  return out;
}

// Read an uploaded image file (resized if needed) as a data URL.
export function readImageFile(
  file: File | undefined,
  tooBigMsg: string,
  onOk: (dataUrl: string) => void,
  maxDimension?: number,
) {
  if (!file) return;
  prepareImage(file, maxDimension).then(onOk).catch(() => alert(tooBigMsg));
}

export function isInline(src: string): boolean {
  return src.startsWith('data:');
}

// Upload every inline (data:) image in the drafts and swap in the server URL.
export async function uploadInlineImages(
  products: Product[],
  gallery: GalleryImage[],
  settings: SiteSettings,
  onProgress?: (done: number, total: number) => void,
) {
  const all = [
    ...products.map((p) => p.image),
    ...gallery.map((g) => g.image),
    settings.logoImage, settings.heroImage, settings.homeImage, settings.aboutImage,
  ].filter((v) => v && isInline(v));
  const unique = Array.from(new Set(all));
  const done = new Map<string, string>();
  let count = 0;
  onProgress?.(0, unique.length);
  for (const value of unique) {
    const blob = await (await fetch(value)).blob();
    done.set(value, await uploadImage(blob));
    onProgress?.(++count, unique.length);
  }
  const swap = (v: string) => (v && done.has(v) ? (done.get(v) as string) : v);
  return {
    changed: unique.length > 0,
    products: products.map((p) => ({ ...p, image: swap(p.image) })),
    gallery: gallery.map((g) => ({ ...g, image: swap(g.image) })),
    settings: {
      ...settings,
      logoImage: swap(settings.logoImage),
      heroImage: swap(settings.heroImage),
      homeImage: swap(settings.homeImage),
      aboutImage: swap(settings.aboutImage),
    },
  };
}
