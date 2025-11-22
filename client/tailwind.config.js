/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#111322',
          accent: '#B3FFAB',
          muted: '#898AA6',
        },
      },
    },
  },
  plugins: [],
};

