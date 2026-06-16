import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { useSettings } from '../content/SettingsContext';

export default function Header() {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { key: 'home', path: '/' },
    { key: 'about', path: '/about' },
    { key: 'products', path: '/products' },
    { key: 'gallery', path: '/gallery' },
    { key: 'contact', path: '/contact' },
  ];

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/60 backdrop-blur-xl py-3 border-b border-white/60 shadow-soft'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src="/assets/logo.png" alt="Döwletli Logo" className="h-9 w-9 object-contain" />
          <span className="text-lg font-extrabold tracking-tight text-brand-ink">
            {settings.brandName}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              to={link.path}
              className={`text-sm font-medium transition-colors ${
                isActive(link.path) ? 'text-brand-ink' : 'text-brand-slate hover:text-brand-ink'
              }`}
            >
              {t(`nav.${link.key}`)}
            </Link>
          ))}
          <span className="w-px h-5 bg-brand-border" />
          <LanguageSwitcher />
          <Link to="/book" className="btn-primary !px-5 !py-2.5 text-sm">
            {t('hero.book')}
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-brand-ink p-1"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/60 shadow-card p-6 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-lg font-medium py-3 border-b border-brand-border ${
                isActive(link.path) ? 'text-brand-ink' : 'text-brand-slate'
              }`}
            >
              {t(`nav.${link.key}`)}
            </Link>
          ))}
          <div className="pt-5 flex items-center justify-between gap-4">
            <LanguageSwitcher />
            <Link to="/book" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary text-sm flex-1">
              {t('hero.book')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
