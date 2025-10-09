/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
// components/EventBannerCarousel.tsx
"use client";

import { useState, useEffect } from "react";
import { type Event } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface EventBannerCarouselProps {
  events: Event[];
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

export default function EventBannerCarousel({
  events,
}: EventBannerCarouselProps) {
  if (!events || events.length === 0) return null;

  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    setPage(([prevPage, _]) => {
      const newPage = (prevPage + newDirection + events.length) % events.length;
      return [newPage, newDirection];
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const eventIndex = page;

  return (
    <section className="relative w-full aspect-[368/100] md:aspect-[368/77] rounded-xl overflow-hidden shadow-lg group">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute w-full h-full"
        >
          <Link
            href={`/event/${events[eventIndex].slug}`}
            className="block w-full h-full"
          >
            <Image
              src={events[eventIndex].image_url || "/hero-bg.webp"}
              alt={events[eventIndex].title}
              fill
              priority={eventIndex === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <h2 className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-white text-lg md:text-2xl font-bold drop-shadow-md max-w-[80%]">
              {events[eventIndex].title}
            </h2>
          </Link>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={() => paginate(-1)}
        className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 h-8 w-8 bg-black/30 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <FiChevronLeft />
      </button>
      <button
        onClick={() => paginate(1)}
        className="absolute top-1/2 -translate-y-1/2 right-2 md:right-4 h-8 w-8 bg-black/30 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <FiChevronRight />
      </button>
    </section>
  );
}
