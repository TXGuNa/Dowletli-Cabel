/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // All brand colors come from CSS variables (see src/index.css and
      // src/content/themes.ts) so the admin can switch themes at runtime.
      // The defaults in :root are the original "Classic" palette.
      colors: {
        'brand-bg': 'rgb(var(--c-bg) / <alpha-value>)',
        'brand-surface': 'rgb(var(--c-surface) / <alpha-value>)',
        'brand-soft': 'rgb(var(--c-soft) / <alpha-value>)',
        'brand-primary': 'rgb(var(--c-primary) / <alpha-value>)',
        'brand-blue': 'rgb(var(--c-blue) / <alpha-value>)',
        'brand-cyan': 'rgb(var(--c-cyan) / <alpha-value>)',
        'brand-teal': 'rgb(var(--c-teal) / <alpha-value>)',
        'brand-ink': 'rgb(var(--c-ink) / <alpha-value>)',
        'brand-text': 'rgb(var(--c-text) / <alpha-value>)',
        'brand-slate': 'rgb(var(--c-slate) / <alpha-value>)',
        'brand-border': 'rgb(var(--c-border) / <alpha-value>)',
        'brand-on-primary': 'rgb(var(--c-on-primary) / <alpha-value>)',
        'brand-overlay': 'rgb(var(--c-overlay) / <alpha-value>)',
        'brand-glass': 'rgb(var(--c-glass) / <alpha-value>)',
        'brand-glass-border': 'rgb(var(--c-glass-border) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      // Card corners scale with the theme; buttons/pills use --radius-btn.
      borderRadius: {
        xl: 'calc(0.75rem * var(--radius-scale, 1))',
        '2xl': 'calc(1rem * var(--radius-scale, 1))',
        '3xl': 'calc(1.5rem * var(--radius-scale, 1))',
        '4xl': 'calc(1.75rem * var(--radius-scale, 1))',
        '5xl': 'calc(2rem * var(--radius-scale, 1))',
        btn: 'var(--radius-btn, 9999px)',
      },
      boxShadow: {
        'soft': '0 8px 30px -14px rgb(var(--c-primary) / 0.22)',
        'card': '0 24px 60px -28px rgb(var(--c-shadow) / 0.28)',
        'glass': '0 12px 44px -18px rgb(var(--c-primary) / 0.24)',
        'glow': '0 0 44px rgb(var(--c-cyan) / 0.34)',
        'neon': '0 0 26px rgb(var(--c-cyan) / 0.30)',
      },
      backgroundImage: {
        'hero-grid': 'linear-gradient(to right, rgb(var(--c-primary) / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--c-primary) / 0.05) 1px, transparent 1px)',
        'aurora': 'radial-gradient(40% 50% at 15% 20%, rgb(var(--c-primary) / 0.18) 0%, transparent 60%), radial-gradient(40% 50% at 85% 15%, rgb(var(--c-cyan) / 0.20) 0%, transparent 60%), radial-gradient(45% 55% at 60% 90%, rgb(var(--c-teal) / 0.14) 0%, transparent 60%)',
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
