import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-brand-navy">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/hero-bg.png"
          alt="Fiber Optic Manufacturing"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/90 to-brand-navy/60" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >


            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              {t('hero.title')} <br />
              <span className="text-gradient-primary">
                {t('hero.highlight')}
              </span>
            </h1>
            
            <p className="text-xl text-brand-slate max-w-2xl mb-10 leading-relaxed font-light">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/25 group"
              >
                {t('hero.cta')}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>

            </div>
          </motion.div>
        </div>
      </div>


    </section>
  );
}
