import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="pt-32 pb-20 min-h-screen bg-brand-navy selection:bg-brand-cyan/30 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-brand-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-brand-cyan/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-6 relative z-10"
      >
        <div className="flex flex-col gap-16 md:gap-24">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                <Trans i18nKey="about.title" components={{ 1: <span className="text-gradient" /> }} />
              </h1>
            </motion.div>
          </div>

          {/* Mission Card */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-brand-surface/50 backdrop-blur-md border border-brand-white/10 p-8 md:p-12 rounded-3xl text-center shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <h2 className="text-2xl md:text-4xl font-light text-brand-white leading-relaxed italic relative z-10">
              "{t('about.mission')}"
            </h2>
          </motion.div>

          {/* Content Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.div 
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <span className="text-brand-cyan font-mono text-sm tracking-wider uppercase">{t('about.label')}</span>
                <h3 className="text-3xl font-bold text-white">{t('about.story.title')}</h3>
              </div>
              
              <div className="space-y-6 text-brand-slate text-lg leading-relaxed">
                <p className="border-l-2 border-brand-primary/30 pl-6">
                  {t('about.description')}
                </p>
                <p>
                  {t('about.history')}
                </p>
                <p>
                  {t('about.expansion')}
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-brand-primary rounded-2xl rotate-3 opacity-20 blur-sm" />
              <div className="relative rounded-2xl overflow-hidden border border-brand-white/10 shadow-2xl aspect-[4/3] group">
                <div className="absolute inset-0 bg-brand-navy/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img 
                  src="/assets/about-us-new.jpg" 
                  alt="Döwletli Trade Show Booth" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                />
              </div>
            </motion.div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
