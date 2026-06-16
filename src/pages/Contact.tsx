import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { ArrowUpRight, MapPin, Phone, Mail, CheckCircle2, Clock } from 'lucide-react';
import { useState } from 'react';
import { addSubmission } from '../content/submissionsStore';
import { useSettings } from '../content/SettingsContext';
import SocialIcon from '../components/SocialIcon';

function Field({
  label, type, id, textarea,
}: { label: string; type?: string; id: string; textarea?: boolean }) {
  const base =
    'peer w-full bg-transparent border-b border-brand-border px-0 pt-6 pb-2 text-brand-ink placeholder-transparent focus:outline-none focus:border-brand-ink transition-colors';
  return (
    <div className="relative">
      {textarea ? (
        <textarea id={id} rows={3} placeholder={label} required className={`${base} resize-none`} />
      ) : (
        <input id={id} type={type} placeholder={label} required className={base} />
      )}
      <label
        htmlFor={id}
        className="absolute left-0 top-1 text-xs font-medium text-brand-slate transition-all
                   peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-slate
                   peer-focus:top-1 peer-focus:text-xs peer-focus:text-brand-ink pointer-events-none"
      >
        {label}
      </label>
    </div>
  );
}

export default function Contact() {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const socials = settings.socials.filter((s) => s.url.trim());
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.querySelector('#name') as HTMLInputElement)?.value.trim() || '';
    const email = (form.querySelector('#email') as HTMLInputElement)?.value.trim() || '';
    const message = (form.querySelector('#message') as HTMLTextAreaElement)?.value.trim() || '';
    addSubmission({ type: 'contact', name, email, message });
    setSent(true);
    form.reset();
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="min-h-screen bg-brand-bg relative overflow-hidden">
      <div className="absolute top-10 right-0 w-[460px] h-[460px] bg-brand-cyan/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[460px] h-[460px] bg-brand-primary/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="pt-36 pb-24 container mx-auto px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div>
              <span className="eyebrow mb-6">{t('contact.title')}</span>
              <h1 className="text-4xl md:text-7xl font-extrabold text-brand-ink tracking-tight leading-[1.0] mb-6">
                <Trans i18nKey="contact.hero_title" components={{ 1: <span className="text-brand-primary" /> }} />
              </h1>
              <p className="text-brand-text text-lg max-w-md">{t('contact.subtitle')}</p>
            </div>

            <div className="space-y-6 border-t border-brand-border pt-8">
              <div className="flex items-start gap-4">
                <MapPin className="text-brand-ink shrink-0 mt-1" size={20} strokeWidth={1.6} />
                <div>
                  <div className="text-xs font-medium text-brand-slate mb-1">{t('contact.badges.facility')}</div>
                  <p className="text-brand-ink font-medium">{t('contact.info.address')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="text-brand-ink shrink-0 mt-1" size={20} strokeWidth={1.6} />
                <div>
                  <div className="text-xs font-medium text-brand-slate mb-1">{t('contact.labels.phone')}</div>
                  <p className="text-brand-ink font-medium">{t('contact.info.phone')}</p>
                  <p className="text-brand-text text-sm">{t('contact.info.mobile')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="text-brand-ink shrink-0 mt-1" size={20} strokeWidth={1.6} />
                <div>
                  <div className="text-xs font-medium text-brand-slate mb-1">{t('contact.labels.email')}</div>
                  <p className="text-brand-ink font-medium break-all">{t('contact.info.email')}</p>
                </div>
              </div>
            </div>

            {socials.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {socials.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    title={s.platform}
                    className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center text-brand-slate hover:bg-brand-ink hover:text-white hover:border-brand-ink transition-all"
                  >
                    <SocialIcon platform={s.platform} size={17} />
                  </a>
                ))}
              </div>
            )}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:sticky lg:top-28"
          >
            <div className="relative glass-strong rounded-3xl p-8 md:p-10 overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-primary to-brand-cyan" />

              <h2 className="text-xl font-bold text-brand-ink mb-1">{t('contact.sendMessage')}</h2>
              <p className="text-brand-slate text-sm mb-8 flex items-center gap-1.5">
                <Clock size={14} /> {t('contact.form.sent')}
              </p>

              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-brand-cyan text-white flex items-center justify-center mb-5 shadow-soft">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-brand-ink mb-2">{t('contact.form.success')}</h3>
                    <p className="text-brand-text">{t('contact.form.sent')}</p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-7"
                  >
                    <Field label={t('contact.form.name')} type="text" id="name" />
                    <Field label={t('contact.form.email')} type="email" id="email" />
                    <Field label={t('contact.form.message')} id="message" textarea />

                    <button type="submit" className="btn-primary w-full group">
                      <span>{t('contact.form.send')}</span>
                      <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
