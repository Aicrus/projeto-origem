const { colors } = require('./designer-system/tokens/colors');
const { spacing } = require('./designer-system/tokens/spacing');
const { fontSize, fontFamily } = require('./designer-system/tokens/typography');
const { borderRadius } = require('./designer-system/tokens/borders');
const { boxShadow, opacity, zIndex, transitionDuration } = require('./designer-system/tokens/effects');
const { breakpoints } = require('./designer-system/tokens/breakpoints');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./contexts/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      spacing,
      fontSize,
      fontFamily,
      borderRadius,
      boxShadow,
      opacity,
      zIndex,
      transitionDuration,
      screens: breakpoints,
    },
  },
  plugins: [],
} 