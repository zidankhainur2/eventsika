"use client";

import { motion } from "framer-motion";
import EventCard from "@/components/EventCard";
import { type Event } from "@/lib/types";
import { type User } from "@supabase/supabase-js";

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

interface SavedEventsGridProps {
  events: Event[];
  user: User | null;
}

export default function SavedEventsGrid({
  events,
  user,
}: SavedEventsGridProps) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      variants={gridVariants}
      initial="hidden"
      animate="visible"
    >
      {events.map((event) => (
        <EventCard key={event.id} event={event} isSaved={true} user={user} />
      ))}
    </motion.div>
  );
}
