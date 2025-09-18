// components/Hero.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="relative text-center py-20 sm:py-28 bg-cover bg-center rounded-xl shadow-md overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
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
          <Link
            href="#events"
            className="bg-[#FFD700] text-on-accent font-bold py-3 px-6 rounded-lg hover:bg-yellow-500 transition-colors shadow-lg"
          >
            Jelajahi Event
          </Link>
          <Link
            href="/submit-event"
            className="bg-white/20 backdrop-blur-sm border border-white/50 text-white font-bold py-3 px-6 rounded-lg hover:bg-white/30 transition-colors shadow-lg"
          >
            Submit Event
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
