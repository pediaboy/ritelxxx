import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        galaxy: {
          bg: '#050510',
          card: '#0d0d2b',
          border: '#1a1a4e',
          accent: '#6c63ff',
          gold: '#f5c518',
          glow: '#a78bfa',
        },
      },
      animation: {
        'star-field': 'starField 60s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        starField: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px #6c63ff44' },
          '50%': { boxShadow: '0 0 30px #6c63ffaa, 0 0 60px #6c63ff44' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
