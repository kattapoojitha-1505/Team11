/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          150: '#E4E7EB',
          250: '#D2D6DC',
          450: '#9EA5B1',
          550: '#6B7280',
          650: '#4B5563'
        }
      }
    },
  },
  plugins: [],
}
