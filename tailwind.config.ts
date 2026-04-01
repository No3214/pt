/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#FAF6F1', dark: '#1a1a2e' },
        'text-main': { DEFAULT: '#1C1917', dark: '#e6e6e6' },
        'text-light': { DEFAULT: '#57534E', dark: '#a0a0b0' },
        terracotta: '#C2684A',
        sage: '#7A9E82',
        sand: '#D4C4AB',
        coast: '#5e8fa8',
        card: { DEFAULT: '#FFFFFF', dark: '#16213e' },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '16px',
        lg: '32px',
      },
      boxShadow: {
        sm: '0 4px 6px -1px rgba(0,0,0,0.05)',
        md: '0 10px 15px -3px rgba(0,0,0,0.05)',
        float: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
      },
      keyframes: {
        pulse: {
          '0%': { boxShadow: '0 0 0 0 rgba(194,104,74,0.4)' },
          '70%': { boxShadow: '0 0 0 6px rgba(194,104,74,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(194,104,74,0)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        pulse: 'pulse 2s infinite',
        'fade-up': 'fade-up 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
      },
    },
  },
  plugins: [],
}
