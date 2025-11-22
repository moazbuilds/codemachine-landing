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
        neutral: {
          950: '#000000',
          900: '#0a0a0a',
          700: '#404040',
        },
        primary: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        blue: {
          500: '#3b82f6',
        },
        emerald: {
          400: '#34d399',
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
        'shimmer': {
          '0%': {
            backgroundPosition: '-200% center',
          },
          '100%': {
            backgroundPosition: '200% center',
          },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.3s ease-out',
        'pulse-slow': 'pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
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
