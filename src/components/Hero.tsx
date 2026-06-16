import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

function FiberLines() {
  // Decorative animated fiber-optic strands
  const paths = [
    'M-50 120 C 250 40, 550 200, 900 90 S 1500 180, 1700 80',
    'M-50 200 C 300 120, 600 280, 950 170 S 1500 240, 1700 160',
    'M-50 290 C 250 230, 620 360, 980 260 S 1480 330, 1700 250',
    'M-50 60 C 300 10, 650 120, 980 30 S 1520 110, 1700 20',
  ];
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1600 360"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <defs>
        <linearGradient id="fiber" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2563EB" stopOpacity="0" />
          <stop offset="35%" stopColor="#2563EB" stopOpacity="0.5" />
          <stop offset="65%" stopColor="#06B6D4" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke="url(#fiber)"
          strokeWidth={i % 2 ? 1.5 : 2.5}
          strokeLinecap="round"
          strokeDasharray="6 14"
          className="animate-dash"
          style={{ animationDuration: `${14 + i * 4}s`, opacity: 0.7 }}
        />
      ))}
    </svg>
  );
}

export default function Hero() {
  const { t } = useTranslation();

  const stats = [
    { num: t('hero.stat1num'), label: t('hero.stat1label') },
    { num: t('hero.stat2num'), label: t('hero.stat2label') },
    { num: t('hero.stat3num'), label: t('hero.stat3label') },
  ];

  return (
    <section className="relative overflow-hidden bg-brand-bg">
      {/* Aurora + grid + fiber background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-aurora" />
        <div className="absolute inset-0 bg-hero-grid bg-[size:46px_46px] opacity-60" />
        <div className="absolute -top-24 -left-20 w-[460px] h-[460px] bg-brand-primary/20 rounded-full blur-[130px] animate-drift-slow" />
        <div className="absolute top-10 right-0 w-[420px] h-[420px] bg-brand-cyan/20 rounded-full blur-[130px] animate-drift" />
        <div className="absolute top-0 left-0 right-0 h-[360px]"><FiberLines /></div>
      </div>

      <div className="container mx-auto px-6 pt-36 pb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm font-semibold text-brand-primary">
            <Sparkles size={15} />
            {t('brand.tagline')}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="text-[2.75rem] sm:text-6xl xl:text-8xl font-extrabold text-brand-ink leading-[0.98] tracking-tight max-w-5xl"
        >
          {t('hero.title')}{' '}
          <span className="text-gradient">{t('hero.highlight')}</span>
        </motion.h1>

        <div className="mt-12 grid lg:grid-cols-12 gap-10 items-end">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-6 text-lg md:text-xl text-brand-text leading-relaxed max-w-xl"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-6 flex flex-col sm:flex-row gap-3 lg:justify-end"
          >
            <Link to="/products" className="btn-primary group">
              {t('hero.cta')}
              <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <Link to="/book" className="btn-ghost">
              {t('hero.book')}
            </Link>
          </motion.div>
        </div>

        {/* Glass-framed hero image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-16 relative rounded-[1.75rem] p-2 glass"
        >
          <div className="relative rounded-3xl overflow-hidden aspect-[16/10] md:aspect-[21/9]">
            <img
              src="/assets/hero-bg.png"
              alt="Fiber Optic Manufacturing"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/25 via-transparent to-transparent" />
          </div>
        </motion.div>

        {/* Glass stats */}
        <div className="mt-12 grid grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="glass rounded-2xl px-5 py-6 text-center">
              <div className="text-3xl md:text-5xl font-extrabold text-brand-ink tracking-tight">{s.num}</div>
              <div className="text-sm text-brand-slate mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
