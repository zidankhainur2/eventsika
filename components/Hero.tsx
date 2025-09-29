// components/Hero.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "./ui/Input";
import { CATEGORIES } from "@/lib/constants";
import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    const currentCategory = params.get("category");

    if (category === currentCategory) {
      params.delete("category");
    } else if (category) {
      params.set("category", category);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="relative text-center py-20 sm:py-28 bg-cover bg-center rounded-xl shadow-md overflow-hidden">
      <Image
        src="/hero-bg.webp"
        alt="Audience at an event"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-primary/70" />

      <motion.div
        className="relative max-w-3xl mx-auto px-4 z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl font-bold text-white tracking-tight drop-shadow-lg"
        >
          Temukan dan Bagikan Event Kampus Terbaik
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="mt-6 text-lg text-gray-200 drop-shadow"
        >
          EventSika adalah pusat informasi untuk semua kegiatan dan acara di
          lingkungan kampus. Jangan lewatkan kesempatan untuk berkembang!
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-8 flex justify-center gap-4 flex-wrap"
        >
          <div className="relative w-full max-w-lg mx-auto">
            <FiSearch className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari nama event, lokasi, atau penyelenggara..."
              onChange={(e) => handleSearch(e.target.value)}
              defaultValue={searchParams.get("search") ?? ""}
              className="pl-12 w-full !py-4 rounded-full"
            />
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-4 flex justify-center gap-2 flex-wrap"
        >
          {CATEGORIES.map((cat) => {
            const isActive = searchParams.get("category") === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  isActive
                    ? "bg-accent text-on-accent"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
