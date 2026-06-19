import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { useSettings } from '../content/SettingsContext';

export default function About() {
  const { t } = useTranslation();
  const { settings } = useSettings();

  return (
    <div className="pt-28 sm:pt-36 pb-20 sm:pb-24 min-h-screen bg-brand-bg relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-[480px] h-[480px] bg-brand-cyan/12 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[460px] h-[460px] bg-brand-primary/12 rounded-full blur-[150px] pointer-events-none" />
      <div className="container mx-auto px-6 relative">
        <div className="flex flex-col gap-20 md:gap-28">
          {/* Header */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="max-w-4xl"
          >
            <span className="eyebrow mb-6">{t('about.label')}</span>
            <h1 className="text-4xl md:text-7xl font-extrabold text-brand-ink tracking-tight leading-[1.0]">
              <Trans i18nKey="about.title" components={{ 1: <span className="text-brand-primary" /> }} />
            </h1>
          </motion.div>

          {/* Mission — large editorial quote */}
          <motion.blockquote
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="glass rounded-[2rem] p-10 md:p-14 max-w-4xl"
          >
            <p className="text-2xl md:text-4xl font-medium text-brand-ink leading-[1.3] tracking-tight">
              “<span className="text-gradient">{t('about.mission')}</span>”
            </p>
          </motion.blockquote>

          {/* Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl md:text-3xl font-extrabold text-brand-ink tracking-tight">{t('about.story.title')}</h3>
              <div className="space-y-5 text-brand-text text-lg leading-relaxed">
                <p>{t('about.description')}</p>
                <p>{t('about.history')}</p>
                <p>{t('about.expansion')}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 24, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative p-2 glass rounded-[1.75rem]"
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
                <img
                  src={settings.aboutImage || '/assets/about-us-new.jpg'}
                  alt="Döwletli"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
