import { motion } from 'framer-motion';
import { ArrowUpRight, ImageOff } from 'lucide-react';

interface ProductCardProps {
  title: string;
  description: string;
  image: string;
  category: string;
  specs: string[];
}

export default function ProductCard({ title, description, image, category, specs }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group relative glass rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-card transition-all duration-300 h-full flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[5/4] overflow-hidden bg-brand-soft shrink-0">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-slate">
            <ImageOff size={28} strokeWidth={1.5} />
          </div>
        )}
        <span className="absolute top-4 left-4 text-[11px] font-semibold tracking-[0.14em] uppercase text-brand-primary bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-white/70 shadow-soft">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-lg font-bold text-brand-ink">{title}</h3>
          <ArrowUpRight size={18} className="text-brand-slate group-hover:text-brand-primary shrink-0 mt-1 transition-colors" />
        </div>
        <p className="text-brand-text text-sm mb-5 leading-relaxed line-clamp-3">{description}</p>

        <ul className="mt-auto space-y-2 border-t border-white/60 pt-4">
          {specs.map((spec, i) => (
            <li key={i} className="flex gap-3 items-baseline text-sm text-brand-text">
              <span className="text-brand-primary font-mono text-xs shrink-0">0{i + 1}</span>
              <span>{spec}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
