// components/AnimatedEventGrid.tsx
"use client";

import { type Event } from "@/lib/types";
import { motion } from "framer-motion";
import EventCard from "./EventCard";

interface AnimatedEventGridProps {
  events: Event[];
}

export default function AnimatedEventGrid({ events }: AnimatedEventGridProps) {
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      variants={gridVariants}
      initial="hidden"
      animate="visible"
    >
      {events.map((event) => (
        <EventCard key={event.id} event={event} isSaved={false} user={null} />
      ))}
    </motion.div>
  );
}
