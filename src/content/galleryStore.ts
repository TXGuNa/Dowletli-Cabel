// Editable gallery — lets the admin add/remove the photos shown on the Gallery
// page. Seeded from the original images, then stored in the browser.

export type GalleryCategory = 'factory' | 'products' | 'events';

export interface GalleryImage {
  id: string;
  image: string;            // URL or data URL
  category: GalleryCategory;
  hidden?: boolean;         // when true, kept in admin but not shown on the public Gallery page
}

export const GALLERY_CATEGORIES: GalleryCategory[] = ['factory', 'products', 'events'];

const KEY = 'dowletli_gallery_v1';
export const GALLERY_EVENT = 'dowletli-gallery';

const SEED: { image: string; category: GalleryCategory }[] = [
  { image: '/assets/about-us-new.jpg', category: 'events' },
  { image: '/assets/factory-interior-new.jpg', category: 'factory' },
  { image: '/assets/product-self-supporting.png', category: 'products' },
  { image: '/assets/product-armored-duct.png', category: 'products' },
  { image: '/assets/hero-bg.png', category: 'factory' },
  { image: '/assets/product-flat-drop.png', category: 'products' },
];

export function defaultGallery(): GalleryImage[] {
  return SEED.map((s, i) => ({ id: `g-seed-${i}`, image: s.image, category: s.category }));
}

export function loadGallery(): GalleryImage[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultGallery();
    const data = JSON.parse(raw) as GalleryImage[];
    if (!Array.isArray(data)) return defaultGallery();
    return data
      .filter((g) => g && typeof g.image === 'string')
      .map((g) => ({
        id: g.id || `g-${Math.random().toString(36).slice(2, 8)}`,
        image: g.image,
        category: GALLERY_CATEGORIES.includes(g.category) ? g.category : 'factory',
        hidden: Boolean(g.hidden),
      }));
  } catch {
    return defaultGallery();
  }
}

export function persistGallery(list: GalleryImage[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(GALLERY_EVENT));
  } catch {
    /* storage may be full (large images) */
  }
}

export function makeEmptyImage(): GalleryImage {
  return {
    id: `g-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    image: '',
    category: 'factory',
    hidden: false,
  };
}
