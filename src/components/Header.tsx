import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-brand-navy/90 backdrop-blur-md py-4 shadow-glass' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
             <div className="absolute inset-0 bg-brand-cyan/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
             <img src="/assets/logo.png" alt="Döwletli Logo" className="relative h-10 w-10 object-contain" />
          </div>
          <span className="text-2xl font-bold tracking-wider text-brand-white">
            DÖWLETLI CABEL
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              to={link.path}
              className="text-brand-slate hover:text-brand-cyan font-medium transition-colors text-sm uppercase tracking-wide"
            >
              {t(`nav.${link.key}`)}
            </Link>
          ))}
          <LanguageSwitcher />
          

        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-brand-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-brand-navy/95 backdrop-blur-lg border-t border-brand-white/10 p-6 flex flex-col gap-4 shadow-xl h-screen">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium text-brand-white hover:text-brand-cyan py-2 border-b border-brand-white/5"
            >
              {t(`nav.${link.key}`)}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-4">
            <LanguageSwitcher />

          </div>
        </div>
      )}
    </header>
  );
}
