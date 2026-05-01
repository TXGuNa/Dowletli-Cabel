import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const { t } = useTranslation();
  const productKeys = [
    { key: 'selfSupporting', category: 'aerial', image: '/assets/product-self-supporting.png' },
    { key: 'armoredDuct', category: 'underground', image: '/assets/product-armored-duct.png' },
    { key: 'flatDrop', category: 'ftth', image: '/assets/product-flat-drop.png' },
    { key: 'figure8', category: 'aerial', image: '/assets/product-figure8.png' },
    { key: 'armoredSoil', category: 'directBurial', image: '/assets/product-armored-soil.png' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-brand-dark">
      {/* Background Ambience - Clean Technical Look */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="pt-32 pb-20 container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <Trans i18nKey="products.title" components={{ 1: <span className="text-gradient" /> }} />
          </h1>
          <p className="text-brand-white/60 max-w-2xl mx-auto">
            {t('products.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productKeys.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard 
                title={t(`products.items.${item.key}.title`)}
                description={t(`products.items.${item.key}.description`)}
                category={t(`products.categories.${item.category}`)}
                image={item.image}
                specs={t(`products.items.${item.key}.specs`, { returnObjects: true }) as string[]}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
