const colors = require("tailwindcss/colors");
module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        // https://github.com/Insper/Cores-Marca-Insper
        primary: {
          DEFAULT: "#27A5A2",
          50: "#e9f6f6",
          100: "#bee4e3",
          200: "#93d2d1",
          300: "#68c0be",
          400: "#3daeab",
          500: "#239592",
          600: "#1b7371",
          700: "#145351",
          800: "#0c3131",
          900: "#041010",
        },
        secondary: {
          DEFAULT: "#F58220",
          50: "#fef3e9",
          100: "#fcdabc",
          200: "#fac190",
          300: "#f8a863",
          400: "#f68f36",
          500: "#dd751d",
          600: "#ac5b16",
          700: "#7b4110",
          800: "#49270a",
          900: "#180d03",
        },
        transparent: {
          dark: "rgba(0, 0, 0, 0.1)",
          DEFAULT: "transparent",
          light: "rgba(255, 255, 255, 0.1)",
        },
        black: {
          DEFAULT: "rgba(65, 64, 66, 1)",
          real: "black",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms"), // import tailwind forms
  ],
};
