import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { ShieldCheck, Globe2, Zap, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { t } = useTranslation();

  const features = [
    { icon: ShieldCheck, key: 'quality' },
    { icon: Globe2, key: 'global' },
    { icon: Zap, key: 'reliable' },
  ];

  return (
    <div className="min-h-screen bg-brand-bg">
      <Hero />

      {/* Features — glass cards */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-brand-cyan/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="container mx-auto relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <h2 className="text-3xl md:text-5xl font-extrabold text-brand-ink tracking-tight max-w-2xl">
              {t('home.manufacturing.title')}
            </h2>
            <span className="eyebrow">{t('brand.tagline')}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-3xl p-8 group hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-cyan flex items-center justify-center text-white shadow-soft">
                    <feature.icon size={24} />
                  </div>
                  <span className="text-sm font-mono text-brand-slate">0{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-brand-ink mb-3">{t(`features.${feature.key}.title`)}</h3>
                <p className="text-brand-text leading-relaxed">
                  {t(`features.${feature.key}.description`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[440px] h-[440px] bg-brand-primary/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="container mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <span className="eyebrow mb-5">{t('home.manufacturing.label')}</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-brand-ink mb-6 tracking-tight">
                {t('home.manufacturing.title')}
              </h2>
              <p className="text-brand-text text-lg mb-10 leading-relaxed">
                {t('home.manufacturing.description')}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass rounded-2xl py-6 px-5">
                  <h4 className="text-3xl font-extrabold tracking-tight text-gradient">24/7</h4>
                  <p className="text-brand-slate text-sm mt-1">{t('home.manufacturing.stats.cycle')}</p>
                </div>
                <div className="glass rounded-2xl py-6 px-5">
                  <h4 className="text-3xl font-extrabold tracking-tight text-gradient">100%</h4>
                  <p className="text-brand-slate text-sm mt-1">{t('home.manufacturing.stats.quality')}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 relative p-2 glass rounded-[1.75rem]"
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                <img
                  src="/assets/factory-interior-new.jpg"
                  alt="Factory Interior"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-5 left-5 right-5 glass-strong rounded-2xl p-4">
                <p className="text-brand-ink font-semibold text-sm">{t('home.manufacturing.badge.title')}</p>
                <p className="text-brand-slate text-xs mt-0.5">{t('home.manufacturing.badge.description')}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA — gradient glass */}
      <section className="px-6 pb-24">
        <div className="container mx-auto">
          <div className="relative overflow-hidden rounded-[2rem] px-8 py-16 md:px-16 md:py-20 text-center bg-gradient-to-br from-brand-primary via-brand-blue to-brand-cyan">
            <div className="absolute inset-0 bg-hero-grid bg-[size:40px_40px] opacity-20" />
            <div className="absolute -top-16 -right-10 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-drift" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-5 tracking-tight">
                {t('home.cta.title')}
              </h2>
              <p className="text-white/85 text-lg mb-10 max-w-xl mx-auto">
                {t('home.cta.subtitle')}
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-brand-primary px-8 py-4 rounded-full font-bold hover:-translate-y-0.5 hover:shadow-lg transition-all group"
              >
                {t('home.cta.button')}
                <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
