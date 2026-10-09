import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-[70vh] bg-brand-bg relative overflow-hidden flex items-center">
      <div className="absolute inset-0 bg-aurora opacity-70 pointer-events-none" />
      <div className="container mx-auto px-6 pt-32 pb-24 relative text-center">
        <div className="text-7xl md:text-9xl font-extrabold tracking-tight text-gradient leading-none font-heading">404</div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-brand-ink mt-6">{t('notFound.title')}</h1>
        <p className="text-brand-text text-lg mt-4 max-w-xl mx-auto">{t('notFound.text')}</p>
        <Link to="/" className="btn-primary mt-10 group">
          {t('notFound.button')}
          <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
