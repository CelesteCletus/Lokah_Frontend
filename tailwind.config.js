/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        matte: {
          black: '#0a0a0a',
          950: '#0a0a0a',
          900: '#121212',
          800: '#1a1a1a',
          700: '#222222',
          600: '#2a2a2a',
        },
        charcoal: {
          900: '#1f1f1f',
          800: '#2d2d2d',
          700: '#3a3a3a',
          600: '#484848',
        },
        ivory: {
          50: '#fefef7',
          100: '#fafaf0',
          200: '#f5f5e8',
          300: '#f0f0e0',
          350: '#ececdc',
          400: '#e8e8d8',
          450: '#e4e4d4',
          500: '#e0e0d0',
        },
        champagne: {
          100: '#f7f3e9',
          200: '#e8dcc8',
          300: '#d4c4a8',
          400: '#c4a882',
          450: '#be9f71',
          500: '#b89660',
          600: '#a07840',
          700: '#8a6030',
        },
        gold: {
          50: '#fffdf5',
          100: '#fef9e7',
          200: '#fdf0c3',
          300: '#fbe59a',
          400: '#f8d66a',
          450: '#e6c250',
          500: '#d4af37',
          600: '#b8962e',
          700: '#967724',
          800: '#745a1c',
          900: '#523d14',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Playfair Display', 'serif'],
        body: ['Montserrat', 'Inter', 'sans-serif'],
        accent: ['Cinzel', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-gold': 'linear-gradient(135deg, #d4af37 0%, #f8d66a 50%, #d4af37 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0a0a0a 0%, #1f1f1f 50%, #2d2d2d 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 1.5s ease-out',
        'fade-up': 'fadeUp 1s ease-out',
        'slide-in': 'slideIn 0.8s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'glass-sm': '0 4px 16px rgba(0, 0, 0, 0.3)',
        'gold': '0 4px 20px rgba(212, 175, 55, 0.3)',
        'elegant': '0 20px 60px rgba(0, 0, 0, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
