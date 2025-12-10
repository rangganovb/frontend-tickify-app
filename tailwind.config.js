/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: "#026da7",
        "primary-light": "#1197c7",
        "primary-dark": "#084a61",
        secondary: "#96d8e8",
        tickify: {
          light: "#96D8E8",
          neutral: "#1197C7",
          primary: "#026DA7",
          dark: "#1D3A6B",
        },
      },
    },
  },
  plugins: [],
};
