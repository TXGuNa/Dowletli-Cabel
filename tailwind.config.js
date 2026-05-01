/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-navy': '#020C1B', // Deepest background
        'brand-blue': '#0A192F',  // Secondary background
        'brand-surface': '#112240', // Card/Panel background
        'brand-cyan': '#64FFDA',  // Primary accent (keeping a tech turquoise but refined)
        'brand-primary': '#0070F3', // Corporate Blue for trust
        'brand-white': '#E6F1FF', // Text base
        'brand-slate': '#8892B0', // Muted text
        'brand-dark': '#020C1B',  // Alias for coherence
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'], // Added for technical specs
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'neon': '0 0 10px rgba(100, 255, 218, 0.2), 0 0 20px rgba(100, 255, 218, 0.1)',
        'glow': '0 0 20px rgba(0, 112, 243, 0.4)',
      }
    },
  },
  plugins: [],
}
