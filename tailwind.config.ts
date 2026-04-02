/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#FAF6F1', dark: '#050505' },
        'text-main': { DEFAULT: '#1C1917', dark: '#e6e6e6' },
        'text-light': { DEFAULT: '#57534E', dark: '#a0a0b0' },
        terracotta: { DEFAULT: '#C2684A', light: '#d4896f', dark: '#a8543a' },
        sage: { DEFAULT: '#7A9E82', light: '#96b89e', dark: '#5f7d65' },
        sand: { DEFAULT: '#D4C4AB', light: '#e2d6c3', dark: '#b8a88e' },
        honey: { DEFAULT: '#c49a6c', light: '#d4b38a', dark: '#a87d50' },
        coast: '#5e8fa8',
        card: { DEFAULT: '#FFFFFF', dark: '#111111' },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Outfit', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '16px',
        lg: '32px',
        xl: '24px',
        '2xl': '20px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.04)',
        md: '0 4px 16px rgba(0,0,0,0.06)',
        float: '0 24px 48px rgba(0,0,0,0.08)',
        glow: '0 0 60px rgba(194,104,74,0.15)',
      },
      keyframes: {
        pulse: {
          '0%': { boxShadow: '0 0 0 0 rgba(194,104,74,0.3)' },
          '70%': { boxShadow: '0 0 0 8px rgba(194,104,74,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(194,104,74,0)' },
        },
      },
      animation: {
        pulse: 'pulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'apple': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      spacing: {
        '4.5': '1.125rem',
      },
    },
  },
  plugins: [],
}
