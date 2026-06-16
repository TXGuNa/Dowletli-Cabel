import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  type GalleryImage, GALLERY_EVENT,
  loadGallery, persistGallery, defaultGallery,
} from './galleryStore';

interface GalleryContextValue {
  images: GalleryImage[];
  setImages: (next: GalleryImage[]) => void;
  resetImages: () => void;
}

const GalleryContext = createContext<GalleryContextValue | null>(null);

export function GalleryProvider({ children }: { children: React.ReactNode }) {
  const [images, setImagesState] = useState<GalleryImage[]>(() => loadGallery());

  useEffect(() => {
    const refresh = () => setImagesState(loadGallery());
    window.addEventListener(GALLERY_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(GALLERY_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const value = useMemo<GalleryContextValue>(
    () => ({
      images,
      setImages: (next: GalleryImage[]) => {
        setImagesState(next);
        persistGallery(next);
      },
      resetImages: () => {
        const def = defaultGallery();
        setImagesState(def);
        persistGallery(def);
      },
    }),
    [images],
  );

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGallery() {
  const ctx = useContext(GalleryContext);
  if (!ctx) throw new Error('useGallery must be used within GalleryProvider');
  return ctx;
}
