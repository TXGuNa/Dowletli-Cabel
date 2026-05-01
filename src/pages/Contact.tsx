import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { Send, MapPin, Phone, Mail, Instagram, Linkedin } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const { t } = useTranslation();
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t('contact.form.success'));
  };

  const InputField = ({ label, type, id }: { label: string, type: string, id: string }) => (
    <div className="relative">
      <input
        type={type}
        id={id}
        className={`w-full bg-brand-dark/40 border rounded-xl px-6 py-4 text-white placeholder-transparent focus:outline-none transition-all duration-300 peer ${
          focusedField === id ? 'border-brand-cyan shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'border-brand-white/10 hover:border-brand-white/20'
        }`}
        placeholder={label}
        onFocus={() => setFocusedField(id)}
        onBlur={() => setFocusedField(null)}
        required
      />
      <label
        htmlFor={id}
        className={`absolute left-6 text-sm transition-all duration-300 pointer-events-none ${
          focusedField === id || (document.getElementById(id) as HTMLInputElement)?.value
            ? '-top-2.5 bg-brand-navy px-2 text-brand-cyan text-xs font-semibold'
            : 'top-4 text-brand-white/40'
        }`}
      >
        {label}
      </label>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-brand-dark">
      {/* Background Ambience - Clean Technical Look */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="pt-32 pb-20 container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                <Trans i18nKey="contact.hero_title" components={{ 1: <span className="text-gradient" /> }} />
              </h1>
              <p className="text-brand-white/60 text-lg max-w-lg">
                {t('contact.subtitle')}
              </p>
            </div>

            {/* Factory Location Card */}
            <div className="relative group overflow-hidden rounded-2xl border border-brand-white/10 aspect-[16/9] shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent z-10" />
              <img 
                src="/assets/hero-bg.png" 
                alt="Factory Location" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-6 left-6 z-20">
                <div className="flex items-center gap-2 text-brand-cyan mb-1">
                  <MapPin size={16} />
                  <span className="text-xs font-mono tracking-widest uppercase">{t('contact.badges.facility')}</span>
                </div>
                <h3 className="text-white font-bold text-xl">{t('contact.info.address')}</h3>
              </div>
            </div>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-brand-surface/50 border border-brand-white/5 hover:border-brand-cyan/30 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 flex items-center justify-center text-brand-cyan mb-4 group-hover:scale-110 transition-transform">
                  <Phone size={20} />
                </div>
                <h3 className="text-brand-white/40 text-sm mb-1">{t('contact.labels.phone')}</h3>
                <p className="text-white font-medium text-lg">{t('contact.info.phone')}</p>
                <p className="text-brand-white/60 text-sm mt-1">{t('contact.info.mobile')}</p>
              </div>

              <div className="p-6 rounded-2xl bg-brand-surface/50 border border-brand-white/5 hover:border-brand-cyan/30 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 flex items-center justify-center text-brand-cyan mb-4 group-hover:scale-110 transition-transform">
                  <Mail size={20} />
                </div>
                <h3 className="text-brand-white/40 text-sm mb-1">{t('contact.labels.email')}</h3>
                <p className="text-white font-medium text-lg break-all">{t('contact.info.email')}</p>
              </div>
            </div>
          </motion.div>

          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-b from-brand-cyan/20 to-transparent rounded-[2.5rem] blur-xl opacity-20" />
            <div className="bg-brand-surface/80 p-8 md:p-12 rounded-[2rem] border border-brand-white/10 backdrop-blur-xl shadow-2xl relative">
              <h2 className="text-2xl font-bold text-white mb-8">{t('contact.sendMessage')}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <InputField label={t('contact.form.name')} type="text" id="name" />
                <InputField label={t('contact.form.email')} type="email" id="email" />
                
                <div className="relative">
                  <textarea 
                    id="message"
                    rows={4}
                    className={`w-full bg-brand-dark/40 border rounded-xl px-6 py-4 text-white placeholder-transparent focus:outline-none transition-all duration-300 peer resize-none ${
                        focusedField === 'message' ? 'border-brand-cyan shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'border-brand-white/10 hover:border-brand-white/20'
                    }`}
                    placeholder={t('contact.form.message')}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                  <label
                    htmlFor="message"
                    className={`absolute left-6 text-sm transition-all duration-300 pointer-events-none ${
                      focusedField === 'message' || (document.getElementById('message') as HTMLInputElement)?.value
                        ? '-top-2.5 bg-brand-navy px-2 text-brand-cyan text-xs font-semibold'
                        : 'top-4 text-brand-white/40'
                    }`}
                  >
                    {t('contact.form.message')}
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="w-full group bg-gradient-to-r from-brand-cyan to-brand-primary text-brand-dark font-bold py-5 rounded-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <span className="tracking-wide uppercase text-sm">{t('contact.form.send')}</span>
                  <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="mt-10 pt-8 border-t border-brand-white/5 flex justify-center gap-6">
                <a href="#" className="p-3 rounded-full bg-brand-dark/50 text-brand-white/60 hover:text-white hover:bg-brand-cyan hover:scale-110 transition-all duration-300">
                  <Instagram size={20} />
                </a>
                <a href="#" className="p-3 rounded-full bg-brand-dark/50 text-brand-white/60 hover:text-white hover:bg-brand-cyan hover:scale-110 transition-all duration-300">
                   <Linkedin size={20} />
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
