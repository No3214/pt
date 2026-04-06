/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          light: 'var(--color-secondary-light)',
          dark: 'var(--color-secondary-dark)',
        },
        accent: 'var(--color-accent)',
        sand: 'var(--color-sand)',
        bg: { DEFAULT: 'var(--color-bg)', dark: 'var(--color-bg)' },
        'bg-alt': 'var(--color-bg-alt)',
        'text-main': { DEFAULT: 'var(--color-text)', dark: 'var(--color-text)' },
        'text-light': { DEFAULT: 'var(--color-text-muted)', dark: 'var(--color-text-muted)' },
        card: { DEFAULT: 'var(--color-surface)', dark: 'var(--color-surface)' },
        glow: 'var(--color-glow)',
        // Admin panel color aliases (maps to brand palette)
        terracotta: {
          DEFAULT: '#C2684A',
          dark: '#A8553A',
          light: '#D4856B',
        },
        sage: {
          DEFAULT: '#7A9E82',
          dark: '#628069',
          light: '#96B89E',
        },
        coast: {
          DEFAULT: '#5e8fa8',
          dark: '#4A7389',
          light: '#7EADC2',
        },
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
        sm: '0 1px 2px var(--shadow-color)',
        md: '0 4px 12px var(--shadow-color)',
        float: '0 20px 40px var(--shadow-color)',
        glow: '0 0 60px var(--color-glow)',
        'glow-lg': '0 0 100px var(--color-glow)',
      },
      spacing: {
        '4.5': '1.125rem',
      },
      keyframes: {
        pulse: {
          '0%': { boxShadow: '0 0 0 0 color-mix(in srgb, var(--color-primary) 30%, transparent)' },
          '70%': { boxShadow: '0 0 0 6px color-mix(in srgb, var(--color-primary) 0%, transparent)' },
          '100%': { boxShadow: '0 0 0 0 color-mix(in srgb, var(--color-primary) 0%, transparent)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        pulse: 'pulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite',
        shimmer: 'shimmer 2s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(0.22, 1, 0.36, 1)',
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
