import { useTranslation } from 'react-i18next';
import Hero from '../components/Hero';

import { ShieldCheck, Globe2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { t } = useTranslation();

  const features = [
    { icon: ShieldCheck, key: 'quality', colSpan: "" },
    { icon: Globe2, key: 'global', colSpan: "" },
    { icon: Zap, key: 'reliable', colSpan: "" },
  ];

  return (
    <div className="min-h-screen bg-brand-navy selection:bg-brand-cyan/30">
      <Hero />
      
      {/* Features "Bento Grid" Section */}
      <section className="section-padding relative z-10 py-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${feature.colSpan} relative overflow-hidden p-6 rounded-2xl bg-brand-surface border border-brand-white/5 hover:border-brand-primary/30 transition-all duration-500 group h-full`}
              >
                {/* Gradient Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Large Watermark Number */}
                <div className="absolute -top-6 -right-6 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <span className="text-[10rem] font-bold text-white font-mono leading-none">
                    0{index + 1}
                  </span>
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-xl bg-brand-navy border border-brand-white/10 flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 group-hover:border-brand-primary/50 group-hover:shadow-lg group-hover:shadow-brand-primary/20 transition-all duration-300">
                      <feature.icon size={28} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">{t(`features.${feature.key}.title`)}</h3>
                    <p className="text-brand-slate leading-relaxed max-w-sm">
                      {t(`features.${feature.key}.description`)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Factory Capabilities / Why Choose Us */}
      <section className="section-padding bg-brand-surface border-y border-brand-white/5">
        <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                    <span className="text-brand-cyan font-mono text-sm tracking-widest uppercase mb-4 block">{t('home.manufacturing.label')}</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t('home.manufacturing.title')}</h2>
                    <p className="text-brand-slate text-lg mb-8 leading-relaxed">
                        {t('home.manufacturing.description')}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-4 border border-brand-white/10 rounded bg-brand-navy/50">
                            <h4 className="text-white font-bold text-lg mb-1">24/7</h4>
                            <p className="text-brand-slate text-sm">{t('home.manufacturing.stats.cycle')}</p>
                        </div>
                        <div className="p-4 border border-brand-white/10 rounded bg-brand-navy/50">
                            <h4 className="text-white font-bold text-lg mb-1">100%</h4>
                            <p className="text-brand-slate text-sm">{t('home.manufacturing.stats.quality')}</p>
                        </div>
                    </div>
                </div>
                <div className="relative h-[400px] rounded-2xl overflow-hidden bg-brand-navy group">
                    <div className="absolute inset-0 bg-brand-primary/20 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity" />
                    <img src="/assets/factory-interior-new.jpg" alt="Factory Interior" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    
                    {/* Floating Badge */}
                    <div className="absolute bottom-8 left-8 z-20 bg-brand-surface/90 backdrop-blur border border-brand-white/10 p-4 rounded-lg shadow-xl max-w-xs">
                        <p className="text-white font-semibold mb-1">{t('home.manufacturing.badge.title')}</p>
                        <p className="text-brand-slate text-xs">{t('home.manufacturing.badge.description')}</p>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
