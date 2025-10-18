"use client";

import { easeOut, motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: easeOut },
    },
  };

  return (
    <section className="relative text-center py-28 sm:py-36 bg-cover bg-center rounded-xl shadow-md overflow-hidden">
      {/* Background Image */}
      <Image
        src="/hero-bg.webp"
        alt="Audience at an event"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-primary/80" />

      {/* Content */}
      <motion.div
        className="relative max-w-4xl mx-auto px-4 z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-lg leading-tight"
        >
          No More FOMO! <br />
          <span className="font-sans text-white/90 text-xl sm:text-2xl lg:text-3xl font-medium">
            Semua Info Ada di Satu Tempat
          </span>
        </motion.h1>
      </motion.div>
    </section>
  );
}
