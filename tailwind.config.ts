// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0A4D68", // Biru Akademik
        accent: "#FF8400", // Oranye Energi
        neutral: {
          white: "#FFFFFF",
          light: "#F5F5F5", // Abu-abu terang
          dark: "#212121", // Abu-abu gelap (untuk teks)
        },
      },
      fontFamily: {
        // Ini sudah benar, biarkan saja
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
