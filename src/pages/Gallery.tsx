import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function Gallery() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Handle ESC key to close modal
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

  const images = [
    { src: '/assets/about-us-new.jpg', category: 'events', aspect: 'landscape' },
    { src: '/assets/factory-interior-new.jpg', category: 'factory', aspect: 'landscape' },
    { src: '/assets/product-self-supporting.png', category: 'products', aspect: 'square' },
    { src: '/assets/product-armored-duct.png', category: 'products', aspect: 'square' },
    { src: '/assets/hero-bg.png', category: 'factory', aspect: 'landscape' },
    { src: '/assets/product-flat-drop.png', category: 'products', aspect: 'square' },
  ];

  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  return (
    <div className="min-h-screen bg-brand-dark relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/95 backdrop-blur-sm p-4 md:p-10 cursor-zoom-out"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-brand-white/10 text-white hover:bg-brand-primary hover:text-white transition-all z-50"
            >
              <X size={32} />
            </button>

            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage}
              alt="Gallery Fullscreen"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-brand-white/10"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-32 pb-20 container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            <Trans i18nKey="gallery.title" components={{ 1: <span className="text-gradient" /> }} />
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-brand-white/60 text-lg max-w-2xl mx-auto"
          >
            {t('gallery.subtitle')}
          </motion.p>
        </div>

        {/* Filter Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center flex-wrap gap-4 mb-16"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2 rounded-full border transition-all duration-300 ${
                selectedCategory === cat.id
                  ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/25'
                  : 'bg-transparent border-brand-white/10 text-brand-slate hover:border-brand-cyan/50 hover:text-brand-cyan'
              }`}
            >
              {t(cat.label)}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredImages.map((img, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={index}
              onClick={() => setSelectedImage(img.src)}
              className="group relative rounded-2xl overflow-hidden aspect-video bg-brand-surface border border-brand-white/5 cursor-zoom-in"
            >
              <div className="absolute inset-0 bg-brand-navy/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <img 
                src={img.src} 
                alt="Gallery Item" 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-end p-6">
                <span className="text-white font-medium capitalize">{img.category}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
