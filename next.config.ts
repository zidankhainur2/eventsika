// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Mengizinkan semua hostname
      },
      {
        protocol: "http",
        hostname: "**", // Mengizinkan semua hostname (untuk development)
      },
    ],
  },
};

export default nextConfig;
