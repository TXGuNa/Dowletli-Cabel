import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import { useSettings } from '../content/SettingsContext';

export default function Footer() {
  const { t } = useTranslation();
  const { settings } = useSettings();

  return (
    <footer className="bg-brand-bg border-t border-brand-border pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <img src="/assets/logo.png" alt="Döwletli Logo" className="h-9 w-9 object-contain" />
              <span className="text-lg font-extrabold tracking-tight text-brand-ink">
                {settings.brandName}
              </span>
            </div>
            <p className="text-brand-text leading-relaxed mb-6 max-w-md">
              {t('about.mission')}
            </p>
            <div className="flex gap-2">
              {[Instagram, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center text-brand-slate hover:bg-brand-ink hover:text-white hover:border-brand-ink transition-all"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="eyebrow mb-5">{t('footer.company')}</h4>
            <ul className="space-y-3 text-brand-text">
              <li><Link to="/about" className="hover:text-brand-ink transition-colors">{t('footer.story')}</Link></li>
              <li><Link to="/products" className="hover:text-brand-ink transition-colors">{t('footer.technology')}</Link></li>
              <li><Link to="/gallery" className="hover:text-brand-ink transition-colors">{t('nav.gallery')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="eyebrow mb-5">{t('contact.title')}</h4>
            <ul className="space-y-4 text-brand-text">
              <li className="flex items-start gap-3">
                <MapPin className="text-brand-ink shrink-0 mt-0.5" size={17} strokeWidth={1.6} />
                <span>{t('contact.info.address')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-brand-ink shrink-0" size={17} strokeWidth={1.6} />
                <span>{t('contact.info.phone')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-brand-ink shrink-0" size={17} strokeWidth={1.6} />
                <span>{t('contact.info.mobile')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-brand-ink shrink-0" size={17} strokeWidth={1.6} />
                <span>{t('contact.info.email')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-brand-slate text-sm">
          <p>&copy; 2026 Döwletli. {t('footer.rights')}</p>
          <Link to="/admin" className="hover:text-brand-ink transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
