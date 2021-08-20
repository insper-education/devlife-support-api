const colors = require("tailwindcss/colors");
module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        // https://github.com/Insper/Cores-Marca-Insper
        primary: {
          dark: "#009491",
          DEFAULT: "#27A5A2",
          light: "#3CBFAE",
        },
        transparent: {
          dark: "rgba(0, 0, 0, 0.1)",
          DEFAULT: "transparent",
          light: "rgba(255, 255, 255, 0.1)",
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
