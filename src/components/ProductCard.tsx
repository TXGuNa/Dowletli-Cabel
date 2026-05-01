import { motion } from 'framer-motion';


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
      whileHover={{ y: -5 }}
      className="group relative bg-brand-surface border border-brand-white/10 rounded-lg overflow-hidden hover:border-brand-primary/50 transition-all duration-300 shadow-lg hover:shadow-brand-primary/10 h-full flex flex-col"
    >
      {/* Image Area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-navy shrink-0">
        <div className="absolute inset-0 bg-gradient-to-t from-brand-surface to-transparent opacity-60 z-10" />
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
        />
        <div className="absolute top-4 right-4 z-20">
          <span className="bg-brand-navy/80 backdrop-blur-sm px-3 py-1 text-xs font-mono text-brand-cyan border border-brand-cyan/20 rounded">
            {category.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-primary transition-colors">{title}</h3>
        <p className="text-brand-slate text-sm mb-4 line-clamp-3">{description}</p>
        
        {/* Specs List */}
        <div className="space-y-2 mb-6 text-sm text-brand-slate font-mono mt-auto">
          {specs.map((spec, i) => (
             <div key={i} className="flex gap-2 items-start border-b border-brand-white/10 pb-1 last:border-0">
               <span className="text-brand-primary shrink-0">•</span>
               <span className="text-brand-silver">{spec}</span>
             </div>
          ))}
        </div>
        

      </div>
    </motion.div>
  );
}
