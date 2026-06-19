import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../content/ProductsContext';
import type { Lang } from '../content/detectLanguage';

export default function Products() {
  const { t, i18n } = useTranslation();
  const { products } = useProducts();
  const lang = (['en', 'ru', 'tkm'].includes(i18n.language) ? i18n.language : 'en') as Lang;

  return (
    <div className="min-h-screen bg-brand-bg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-brand-cyan/12 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[480px] h-[480px] bg-brand-primary/12 rounded-full blur-[150px] pointer-events-none" />
      <div className="pt-28 sm:pt-36 pb-20 sm:pb-24 container mx-auto px-6 relative">
        <div className="max-w-4xl mb-12 sm:mb-16">
          <span className="eyebrow mb-6">{t('brand.tagline')}</span>
          <h1 className="text-4xl md:text-7xl font-extrabold text-brand-ink tracking-tight leading-[1.0] mb-6">
            <Trans i18nKey="products.title" components={{ 1: <span className="text-gradient" /> }} />
          </h1>
          <p className="text-brand-text text-lg max-w-2xl">
            {t('products.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, index) => {
            const text = p.t[lang] || p.t.en;
            const category = t(`products.categories.${p.category}`, { defaultValue: p.category });
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
              >
                <ProductCard
                  title={text.title}
                  description={text.description}
                  category={category || '—'}
                  image={p.image}
                  specs={text.specs}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
