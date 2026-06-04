/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores primarios usando variables CSS HSL para manejo de opacidades
        primary: 'hsl(var(--color-primary) / <alpha-value>)',
        'primary-hover': 'hsl(var(--color-primary-hover) / <alpha-value>)',
        'primary-light': 'hsl(var(--color-primary-light) / <alpha-value>)',
        surface: 'hsl(var(--color-surface) / <alpha-value>)',
        'surface-alt': 'hsl(var(--color-surface-alt) / <alpha-value>)',
        'surface-inset': 'hsl(var(--color-surface-inset) / <alpha-value>)',
        border: 'hsl(var(--color-border) / <alpha-value>)',
        'text-main': 'hsl(var(--color-text-main) / <alpha-value>)',
        'text-muted': 'hsl(var(--color-text-muted) / <alpha-value>)',
        'whatsapp': 'hsl(var(--color-whatsapp) / <alpha-value>)',
        'whatsapp-hover': 'hsl(var(--color-whatsapp-hover) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 hsl(0 0% 0% / 0.07), 0 1px 2px -1px hsl(0 0% 0% / 0.07)',
        'card-hover': '0 10px 30px -5px hsl(0 0% 0% / 0.12), 0 4px 6px -4px hsl(0 0% 0% / 0.08)',
        'price-badge': '0 4px 14px 0 hsl(var(--color-primary) / 0.25)',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.4s ease-out forwards',
        'shimmer': 'shimmer 2s infinite linear',
      },
    },
  },
  plugins: [],
}
