import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-brand-navy border-t border-brand-white/10 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <img src="/assets/logo.png" alt="Döwletli Logo" className="relative h-10 w-10 object-contain" />
              <span className="text-2xl font-bold tracking-wider text-brand-white">
                DÖWLETLI CABEL
              </span>
            </div>
            <p className="text-brand-slate leading-relaxed mb-6">
              {t('about.mission')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded bg-brand-surface border border-brand-white/5 flex items-center justify-center text-brand-slate hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded bg-brand-surface border border-brand-white/5 flex items-center justify-center text-brand-slate hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded bg-brand-surface border border-brand-white/5 flex items-center justify-center text-brand-slate hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">{t('footer.company')}</h4>
            <ul className="space-y-3 text-brand-slate">
              <li><Link to="/about" className="hover:text-brand-cyan transition-colors">{t('footer.story')}</Link></li>
              <li><Link to="/products" className="hover:text-brand-cyan transition-colors">{t('footer.technology')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6">{t('contact.title')}</h4>
            <ul className="space-y-4 text-brand-slate">
              <li className="flex items-start gap-3">
                <MapPin className="text-brand-primary shrink-0 mt-1" size={18} />
                <span>{t('contact.info.address')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-brand-primary shrink-0" size={18} />
                <span>{t('contact.info.phone')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-brand-primary shrink-0" size={18} />
                <span>{t('contact.info.mobile')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-brand-primary shrink-0" size={18} />
                <span>{t('contact.info.email')}</span>
              </li>
            </ul>
          </div>


        </div>

        <div className="border-t border-brand-white/10 pt-8 flex justify-center text-brand-slate/60 text-sm">
          <p>&copy;2026 Döwletli. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}
