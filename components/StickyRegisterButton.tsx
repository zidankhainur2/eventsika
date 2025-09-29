"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { type User } from "@supabase/supabase-js";

interface StickyButtonProps {
  link: string;
  user: User | null;
}

export default function StickyRegisterButton({
  link,
  user,
}: StickyButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (!user) {
      // Jika tidak ada user, arahkan ke halaman login
      router.push("/login");
    } else {
      // Jika ada user, buka link pendaftaran di tab baru
      window.open(link, "_blank", "noopener noreferrer");
    }
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4 border-t border-gray-200 z-40"
    >
      <button
        onClick={handleClick}
        className="w-full text-center block bg-accent text-on-accent font-bold py-3 px-10 rounded-lg text-lg hover:bg-yellow-500 transition-colors shadow-lg"
      >
        Daftar Sekarang
      </button>
    </motion.div>
  );
}
