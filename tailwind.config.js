/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bright glass palette — airy light base, blue→cyan accents
        'brand-bg': '#F3F7FF',       // Soft blue-white page base
        'brand-surface': '#FFFFFF',  // Solid cards
        'brand-soft': '#E9F1FF',     // Tinted fills / hovers
        'brand-primary': '#2563EB',  // Blue
        'brand-blue': '#3B82F6',     // Lighter blue
        'brand-cyan': '#06B6D4',     // Cyan accent
        'brand-teal': '#14B8A6',     // Teal accent
        'brand-ink': '#0E1626',      // Deep navy-ink headings
        'brand-text': '#41506B',     // Body text
        'brand-slate': '#7587A3',    // Muted text
        'brand-border': '#E2EAF7',   // Hairline borders
        // Legacy aliases
        'brand-navy': '#FFFFFF',
        'brand-dark': '#F3F7FF',
        'brand-white': '#0E1626',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        'soft': '0 8px 30px -14px rgba(37, 99, 235, 0.22)',
        'card': '0 24px 60px -28px rgba(14, 22, 38, 0.28)',
        'glass': '0 12px 44px -18px rgba(37, 99, 235, 0.24)',
        'glow': '0 0 44px rgba(6, 182, 212, 0.34)',
        'neon': '0 0 26px rgba(6, 182, 212, 0.30)',
      },
      backgroundImage: {
        'hero-grid': 'linear-gradient(to right, rgba(37,99,235,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(37,99,235,0.05) 1px, transparent 1px)',
        'aurora': 'radial-gradient(40% 50% at 15% 20%, rgba(37,99,235,0.18) 0%, transparent 60%), radial-gradient(40% 50% at 85% 15%, rgba(6,182,212,0.20) 0%, transparent 60%), radial-gradient(45% 55% at 60% 90%, rgba(20,184,166,0.14) 0%, transparent 60%)',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'drift': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(20px, -16px) scale(1.06)' },
        },
        'dash': {
          'to': { 'stroke-dashoffset': '-1000' },
        },
        'fadeIn': {
          'from': { opacity: '0', transform: 'translateY(-6px) scale(0.98)' },
          'to': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'drift': 'drift 16s ease-in-out infinite',
        'drift-slow': 'drift 24s ease-in-out infinite',
        'dash': 'dash 18s linear infinite',
        'fade-in': 'fadeIn 0.14s ease-out',
      },
    },
  },
  plugins: [],
}
