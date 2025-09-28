/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#800000", // Maroon Red
        accent: "#ffd700", // Golden Yellow
        "on-accent": "#332a00", // Dark text on yellow
        neutral: {
          white: "#ffffff",
          light: "#f8f8f8",
          dark: "#1a1a1a",
        },
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
