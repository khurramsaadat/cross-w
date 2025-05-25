import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        yellow: {
          400: '#FBBF24'
        },
        green: {
          500: '#22C55E'
        },
        blue: {
          400: '#60A5FA',
          500: '#3B82F6'
        },
        red: {
          400: '#F87171'
        },
        pink: {
          400: '#F472B6',
          500: '#EC4899'
        },
        rose: {
          400: '#FB7185',
          500: '#F43F5E'
        },
        purple: {
          400: '#C084FC',
          500: '#A855F7'
        },
        violet: {
          400: '#A78BFA'
        },
        indigo: {
          500: '#6366F1'
        },
        orange: {
          400: '#FB923C'
        },
        amber: {
          400: '#FBBF24',
          500: '#F59E0B'
        },
        lime: {
          400: '#A3E635'
        },
        teal: {
          400: '#2DD4BF'
        },
        cyan: {
          400: '#22D3EE',
          500: '#06B6D4'
        },
        emerald: {
          500: '#10B981'
        },
        fuchsia: {
          400: '#E879F9',
          500: '#D946EF'
        }
      },
      opacity: {
        '10': '0.1',
        '20': '0.2',
        '30': '0.3'
      },
      backgroundColor: {
        'game': {
          'bg': '#0A192F'
        }
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }
    },
  },
  plugins: [],
}

export default config 