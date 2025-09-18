// components/StickyRegisterButton.tsx
"use client";

import { motion } from "framer-motion";

export default function StickyRegisterButton({ link }: { link: string }) {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4 border-t border-gray-200 z-40"
    >
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full text-center block bg-accent text-on-accent font-bold py-3 px-10 rounded-lg text-lg hover:bg-yellow-500 transition-colors shadow-lg"
      >
        Daftar Sekarang
      </a>
    </motion.div>
  );
}
