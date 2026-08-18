/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bgPrimary: '#0A0E17',
        bgCard: '#12161F',
        gold: { DEFAULT: '#D4AF37', light: '#F4C430', dark: '#8A6D1F' },
        cyan: 'rgba(0, 240, 255, 0.8)'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
