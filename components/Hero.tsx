"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaMapMarkerAlt, FaTicketAlt, FaStar } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-16 md:py-0 overflow-hidden max-w-7xl mx-auto">
      {/* KIRI: Teks & Call to Action */}
      <motion.div
        className="flex-1 z-10 space-y-6 max-w-2xl pt-10 md:pt-0"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground font-semibold text-sm tracking-wide">
          🎉 Eksklusif Mahasiswa
        </span>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight">
          No More FOMO! <br />
          <span className="text-primary">Temukan Keseruan Kampus</span>
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed">
          Jelajahi ratusan event seru mulai dari festival musik hingga workshop
          teknologi yang dirancang khusus untuk memperkaya masa kuliahmu.
        </p>

        <div className="flex flex-wrap items-center gap-6 pt-4">
          <Button
            asChild
            size="lg"
            className="rounded-xl px-8 py-6 text-lg font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
          >
            <Link href="#events">Jelajahi Event</Link>
          </Button>

          {/* Social Proof Avatars */}
          <div className="flex items-center">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-[#fff8f6] dark:border-background bg-stone-200 overflow-hidden relative"
                >
                  <Image
                    src={`/hero-bg.webp`}
                    alt={`User ${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <span className="pl-4 text-sm font-medium text-gray-600 dark:text-gray-400">
              +500 mahasiswa
              <br />
              baru bergabung
            </span>
          </div>
        </div>
      </motion.div>

      {/* KANAN: Visual / Card Mockup */}
      <motion.div
        className="flex-1 relative w-full h-[500px] md:h-[600px] flex items-center justify-center mt-16 md:mt-0"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        {/* Abstract Glow Background */}
        <div className="absolute w-72 h-72 bg-amber-400/20 dark:bg-primary/20 blur-[100px] -z-10 rounded-full" />

        <div className="relative w-full max-w-sm">
          {/* Mockup Card (Animasi Melayang) */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="bg-white dark:bg-card p-4 rounded-3xl shadow-2xl border border-gray-100 dark:border-border transform rotate-3 hover:rotate-0 transition-transform duration-500"
          >
            <div className="relative rounded-2xl overflow-hidden mb-5 aspect-[4/3]">
              <Image
                src="/hero-bg.webp"
                alt="Event Mockup"
                fill
                className="object-cover"
              />
              <div className="absolute top-3 right-3 bg-white/90 dark:bg-background/90 backdrop-blur px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                <FaStar className="text-amber-500 text-sm" />
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  4.9
                </span>
              </div>
            </div>
            <div className="space-y-2 px-1">
              <p className="text-xs font-bold text-primary tracking-wider uppercase">
                Seni & Budaya
              </p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Night Canvas Festival 2024
              </h3>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm pb-2">
                <FaMapMarkerAlt className="text-primary/70" />
                <span>Auditorium Utama, UI</span>
              </div>
            </div>
          </motion.div>

          {/* Floating Badge (Tiket Terjual) */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              repeat: Infinity,
              duration: 4,
              delay: 1,
              ease: "easeInOut",
            }}
            className="absolute -bottom-8 -left-6 md:-left-12 bg-white dark:bg-card p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-border flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <FaTicketAlt className="text-primary text-xl" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Tiket Terjual
              </p>
              <p className="text-lg font-extrabold text-gray-900 dark:text-white">
                850 / 1000
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
