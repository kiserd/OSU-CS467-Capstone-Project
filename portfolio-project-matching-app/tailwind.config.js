const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    theme: {
      screens: {
        'xs': '420px',
        ...defaultTheme.screens,
      },
    },
    // extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
