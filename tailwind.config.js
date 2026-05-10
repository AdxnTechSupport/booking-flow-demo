/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1B3A4B',
        accent: '#C9A96E',
        'brand-bg': '#FAFAF8',
        'brand-border': '#E8E4DC',
        'brand-text': '#1A1A1A',
        'brand-muted': '#6B7280',
        sage: '#4A7C59',
        'sage-bg': '#DCFCE7',
        'pending-text': '#92400E',
        'pending-bg': '#FEF3C7',
        'confirmed-text': '#065F46',
        'confirmed-bg': '#DCFCE7',
        'cancelled-text': '#7F1D1D',
        'cancelled-bg': '#FEE2E2',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)',
        'card-selected': '0 0 0 2px #1B3A4B, 0 4px 20px rgba(27,58,75,0.15)',
      },
      animation: {
        'fade-slide-up': 'fadeSlideUp 220ms ease-out both',
        'scale-pulse': 'scalePulse 300ms ease-in-out both',
      },
      keyframes: {
        fadeSlideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scalePulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.06)' },
        },
      },
    },
  },
  plugins: [],
}
