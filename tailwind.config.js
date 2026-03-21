/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        earth: {
          50: '#faf6f1',
          100: '#f4eadb',
          200: '#ead4bb',
          300: '#ddb791',
          400: '#d4a373', // Primary gold/ochre
          500: '#c58a52',
          600: '#af7240',
          700: '#925735',
          800: '#794830',
          900: '#623c2a', // Deep earth
        },
        fire: {
          50: '#fdf6f3',
          100: '#fcebe3',
          200: '#f7d1c1',
          300: '#f1af97',
          400: '#e78160',
          500: '#e05f37', // Muted orange/red
          600: '#d14723',
          700: '#bc3c1c',
          800: '#9b331a',
          900: '#802e1a',
        },
      },
      borderRadius: {
        'none': '0px',
        'sm': '0px',
        DEFAULT: '0px',
        'md': '0px',
        'lg': '0px',
        'xl': '0px',
        '2xl': '0px',
        '3xl': '0px',
        'full': '0px',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
        headings: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
