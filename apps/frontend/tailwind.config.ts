import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17211f',
        moss: '#255f4f',
        mint: '#56c7a1',
        coral: '#ec6f66',
        amber: '#e8a93d',
        lilac: '#7a6ff0',
        cloud: '#f7f8f4',
      },
      boxShadow: {
        soft: '0 14px 40px rgba(23, 33, 31, 0.09)',
      },
    },
  },
  plugins: [],
} satisfies Config;
