/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#03658C',
        success: '#3F7E8C',
        danger: '#BF5E70'
      }
    }
  },
  plugins: []
}
