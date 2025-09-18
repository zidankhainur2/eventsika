// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  // Pastikan path ini sudah benar
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Di v4, theme didefinisikan di CSS, jadi bagian ini bisa dikosongkan
  theme: {},
  plugins: [],
};
export default config;
