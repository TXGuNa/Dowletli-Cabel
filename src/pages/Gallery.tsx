import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useGallery } from '../content/GalleryContext';

export default function Gallery() {
  const { t } = useTranslation();
  const { images } = useGallery();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const categories = [
    { id: 'all', label: 'gallery.filters.all' },
    { id: 'factory', label: 'gallery.filters.factory' },
    { id: 'products', label: 'gallery.filters.products' },
    { id: 'events', label: 'gallery.filters.events' },
  ];

  // Only show items that actually have an image (skip empty/placeholder slots).
  const withImages = images.filter((img) => img.image);
  const filteredImages =
    selectedCategory === 'all' ? withImages : withImages.filter((img) => img.category === selectedCategory);

  return (
    <div className="min-h-screen bg-brand-bg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-brand-cyan/12 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[480px] h-[480px] bg-brand-primary/12 rounded-full blur-[150px] pointer-events-none" />
      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-brand-ink/90 backdrop-blur-sm p-4 md:p-10 cursor-zoom-out"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-50"
            >
              <X size={28} />
            </button>
            <motion.img
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              src={selectedImage}
              alt="Gallery"
              className="max-w-full max-h-full object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-36 pb-24 container mx-auto px-6 relative">
        <div className="max-w-4xl mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-extrabold text-brand-ink tracking-tight leading-[1.0] mb-6"
          >
            <Trans i18nKey="gallery.title" components={{ 1: <span className="text-brand-primary" /> }} />
          </motion.h1>
          <p className="text-brand-text text-lg max-w-2xl">{t('gallery.subtitle')}</p>
        </div>

        {/* Filters — minimal underline tabs */}
        <div className="flex flex-wrap gap-6 mb-12 border-b border-brand-border">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`relative pb-4 text-sm font-medium transition-colors ${
                selectedCategory === cat.id ? 'text-brand-ink' : 'text-brand-slate hover:text-brand-ink'
              }`}
            >
              {t(cat.label)}
              {selectedCategory === cat.id && (
                <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-brand-ink" />
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredImages.map((img, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              key={img.id + index}
              onClick={() => setSelectedImage(img.image)}
              className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-white/60 backdrop-blur-xl border border-white/70 shadow-glass cursor-zoom-in hover:-translate-y-1 hover:shadow-card transition-all duration-300"
            >
              <img
                src={img.image}
                alt="Gallery Item"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-semibold tracking-[0.14em] uppercase text-brand-ink bg-white/90 backdrop-blur px-3 py-1 rounded-full border border-brand-border">
                  {t(`gallery.filters.${img.category}`)}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
