// components/EventCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { type Event } from "@/lib/types";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa"; // Impor ikon

function InfoPill({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string | null;
}) {
  if (!text) return null;
  return (
    <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
      <span className="text-primary">{icon}</span>
      <span className="truncate">{text}</span>
    </div>
  );
}

export default function EventCard({ event }: { event: Event }) {
  const eventDate = new Date(event.event_date);

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white rounded-xl shadow-md flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <Link href={`/event/${event.id}`} className="block">
        <div className="relative h-44 w-full">
          <Image
            src={event.image_url || "/hero-background.jpg"}
            alt={`Poster for ${event.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <span className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full self-start mb-2">
          {event.category}
        </span>
        <h2 className="text-lg font-bold text-neutral-dark mb-3 line-clamp-2 flex-grow">
          <Link href={`/event/${event.id}`}>{event.title}</Link>
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <InfoPill
            icon={<FaCalendarAlt />}
            text={eventDate.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          />
          <InfoPill icon={<FaMapMarkerAlt />} text={event.location} />
        </div>
      </div>
    </motion.div>
  );
}
