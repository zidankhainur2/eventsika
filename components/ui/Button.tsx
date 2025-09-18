// components/ui/Button.tsx
"use client"; // Tambahkan ini untuk menggunakan framer-motion

import { motion } from "framer-motion";
import { type ComponentProps } from "react";

type ButtonProps = ComponentProps<typeof motion.button> & {
  variant?: "primary" | "accent";
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const baseClasses =
    "w-full font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 shadow-md";

  // Sesuaikan warna teks berdasarkan varian
  const variantClasses = {
    primary: "bg-primary hover:bg-red-900 text-white",
    accent: "bg-accent hover:bg-yellow-500 text-on-accent", // Teks gelap di atas kuning
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
