/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      colors: {
        drop: {
          purple: '#9333ea',
          pink:   '#ec4899',
          green:  '#1db954',
          dark:   '#0a0a0f',
          card:   '#111118',
          border: '#1e1e2e',
        },
      },
    },
  },
  plugins: [],
}
