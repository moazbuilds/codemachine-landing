import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

export default {
  content: [
    './index.html',
    './public/index.html',
    './src/**/*.{ts,tsx}',
    './docs/**/*.{md,mmd}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#06111f',
          900: '#0a1628',
          800: '#0f1f37',
          700: '#1a2d47',
          600: '#2a3f5f',
        },
        neutral: {
          850: '#171717',
          900: '#0a0a0a',
          925: '#050505',
          950: '#000000',
          700: '#404040',
          600: '#525252',
          500: '#737373',
          400: '#a3a3a3',
          300: '#d4d4d4',
          200: '#e5e5e5',
        },
        primary: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        blue: {
          700: '#1d4ed8',
          600: '#2563eb',
          500: '#3b82f6',
          400: '#60a5fa',
          300: '#93c5fd',
          200: '#bfdbfe',
          light: '#6b9bd1',
          bright: '#8fb4e0',
        },
        emerald: {
          500: '#10b981',
          400: '#34d399',
        },
        purple: {
          400: '#c084fc',
        },
        pink: {
          400: '#f472b6',
        },
        yellow: {
          500: '#eab308',
          400: '#facc15',
          300: '#fde047',
        },
        green: {
          400: '#4ade80',
        },
        orange: {
          300: '#fdba74',
        },
        error: {
          500: '#f87171',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        xs: ['12px', '1.4'],
        sm: ['14px', '1.4'],
        base: ['16px', '1.6'],
        lg: ['18px', '1.6'],
        xl: ['20px', '1.4'],
        '2xl': ['24px', '1.4'],
        '3xl': ['30px', '1.1'],
        '4xl': ['36px', '1.1'],
        '5xl': ['48px', '1.1'],
        '6xl': ['60px', '1.1'],
        '7xl': ['72px', '1.1'],
      },
      spacing: {
        '0': '0px',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
        '32': '128px',
      },
      maxWidth: {
        '7xl': '80rem',
        '5xl': '64rem',
        'md': '28rem',
      },
      borderRadius: {
        'xl': '24px',
        'lg': '16px',
        'full': '9999px',
      },
      backdropBlur: {
        'xl': '24px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'inner-glow': 'inset 0 1px 12px rgba(255, 255, 255, 0.07)',
      },
      keyframes: {
        'fade-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'pulse-slow': {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.5',
          },
        },
        'pulse-slower': {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.4',
          },
        },
        'shimmer': {
          '0%': {
            backgroundPosition: '-200% center',
          },
          '100%': {
            backgroundPosition: '200% center',
          },
        },
        'float': {
          '0%, 100%': {
            transform: 'translate(0, 0) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -30px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
        },
        'float-delayed': {
          '0%, 100%': {
            transform: 'translate(0, 0)',
          },
          '33%': {
            transform: 'translate(-25px, 25px)',
          },
          '66%': {
            transform: 'translate(25px, -15px)',
          },
        },
        'float-vertical': {
          '0%': {
            transform: 'translateY(0) rotate(0deg)',
            opacity: '0',
          },
          '10%': {
            opacity: '1',
          },
          '90%': {
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(-100vh) rotate(360deg)',
            opacity: '0',
          },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.3s ease-out',
        'pulse-slow': 'pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slower': 'pulse-slower 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 20s ease-in-out infinite',
        'float-delayed': 'float-delayed 25s ease-in-out infinite',
        'float-vertical': 'float-vertical 20s linear infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        noise: 'url(/textures/noise.svg)',
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.glass-card': {
          backgroundColor: 'rgba(10, 10, 10, 0.6)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)',
        },
        '.text-glow': {
          textShadow: '0 0 20px rgba(139, 92, 246, 0.45)',
        },
        '.inner-glow': {
          boxShadow: 'inset 0 1px 12px rgba(255, 255, 255, 0.07)',
        },
      })
    }),
  ],
} satisfies Config
