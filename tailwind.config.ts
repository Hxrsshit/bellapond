import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  '#FFFEF8',
          100: '#FFF7D6',
          200: '#FFE8A3',
          300: '#FFD970',
          400: '#FFC940',
          500: '#F5B800',
        },
        sand: {
          100: '#FAF3DC',
          200: '#F0E4B0',
          300: '#DEC97A',
        },
        ink: {
          900: '#1A1A1A',
          800: '#2C2C2C',
          700: '#3D3D3D',
          600: '#555555',
          500: '#6B6B6B',
          400: '#8C8C8C',
          300: '#A0A0A0',
          200: '#CDCDCD',
          150: '#EEEEEE',
          100: '#E5E5E5',
          50:  '#F7F7F7',
        },
      },
      fontFamily: {
        sans:  ['var(--font-inter)',    'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia',   'serif'],
      },
      letterSpacing: {
        widest: '0.25em',
      },
      boxShadow: {
        card:       '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 8px rgba(0,0,0,0.04), 0 16px 40px rgba(0,0,0,0.11)',
        'warm':     '0 4px 24px rgba(255,200,60,0.18)',
        'warm-lg':  '0 8px 40px rgba(255,200,60,0.24)',
        'float':    '0 20px 60px rgba(0,0,0,0.14)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-33.333%)' },
        },
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'pulse-warm': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,200,60,0)' },
          '50%':      { boxShadow: '0 0 0 6px rgba(255,200,60,0.15)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },
      animation: {
        marquee:      'marquee 25s linear infinite',
        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        float:        'float 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        shimmer:      'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
