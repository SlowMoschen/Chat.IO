/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'text': '#0b0704',
      'background': '#f4eae2',
      'grey-bg': '#A9A9A9',
      'primary': '#2f5779',
      'secondary': '#efe2d7',
      'accent': '#4681b4',
      'red': '#cc0000',
      'clear-white': '#fdfff5'
    },
    extend: {},
  },
  plugins: [],
}