const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        'xs': '420px',
        ...defaultTheme.screens,
      },
      colors: {
        'custom-cool-extraDark': '#001219',
        'custom-cool-dark': '#005f73',
        'custom-cool-med': '#0a9396',
        'custom-cool-light': '#94d2bd',
        'custom-cool-extraLight': '#e9d8a6',
        'custom-warm-extraLight': '#ee9b00',
        'custom-warm-light': '#ca6702',
        'custom-warm-med': '#bb3e03',
        'custom-warm-dark': '#ae2012',
        'custom-warm-extraDark': '#9b2226'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
