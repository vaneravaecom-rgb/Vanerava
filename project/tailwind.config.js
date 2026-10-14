/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF3FF',
          100: '#DCE6FF',
          200: '#B8CCFF',
          300: '#8EACFF',
          400: '#5C83F5',
          500: '#1746D1',
          600: '#123BB5',
          700: '#102F91',
          800: '#10286F',
          900: '#12265D',
        },

        accent: {
          50: '#FFFDE6',
          100: '#FFF9B8',
          200: '#FFF176',
          300: '#FFEB3B',
          400: '#FFE91A',
          500: '#FFE500',
          600: '#E6CF00',
          700: '#BFA900',
          800: '#998600',
          900: '#736500',
        },

        black: '#000000',
        white: '#FFFFFF',

        sky2: {
          50: '#EFF9FF',
          100: '#DEF2FF',
          200: '#B6E6FF',
          300: '#75D3FF',
          400: '#2CBEFF',
          500: '#00A4EF',
          600: '#0084C9',
          700: '#006BA3',
          800: '#005A86',
          900: '#054B6F',
        },

        mint: {
          50: '#EFFDF5',
          100: '#D8FBE8',
          200: '#B4F5D3',
          300: '#7AEBB0',
          400: '#38D984',
          500: '#12C067',
          600: '#069B52',
          700: '#037A43',
          800: '#046036',
          900: '#054E2D',
        },
      },

      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },

      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },

      boxShadow: {
        soft: '0 4px 24px -6px rgba(23, 70, 209, 0.12)',
        card: '0 2px 16px -4px rgba(0, 0, 0, 0.08)',
        float: '0 12px 40px -10px rgba(23, 70, 209, 0.25)',
      },

      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        pop: 'pop 0.3s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },

        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },

        pop: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },

  plugins: [],
};