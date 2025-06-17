const { colors } = require('./design-system/tokens/colors');
const { spacing } = require('./design-system/tokens/spacing');
const { fontSize, fontFamily } = require('./design-system/tokens/typography');
const { borderRadius } = require('./design-system/tokens/borders');
const { boxShadow, opacity, zIndex, transitionDuration } = require('./design-system/tokens/effects');
const { breakpoints } = require('./design-system/tokens/breakpoints');

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