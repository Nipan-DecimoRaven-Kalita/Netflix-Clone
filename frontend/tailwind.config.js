/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        netflix: {
          red: '#e50914',
          black: '#141414',
          dark: '#000000',
        },
      },
      backgroundImage: {
        'gradient-netflix': 'linear-gradient(to bottom, rgba(20,20,20,0.6) 0%, rgba(0,0,0,0.9) 100%)',
        'gradient-hero': 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, transparent 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
};
