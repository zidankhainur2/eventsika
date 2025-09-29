"use client";

import Link from "next/link";
import Image from "next/image";
import { type Event } from "@/lib/types";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import SaveEventButton from "./SaveEventButton";
import { type User } from "@supabase/supabase-js";

function InfoPill({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string | null;
}) {
  if (!text) return null;
  return (
    <div className="flex items-center gap-2 text-xs text-gray-600">
      <span className="text-primary">{icon}</span>
      <span className="truncate">{text}</span>
    </div>
  );
}

interface EventCardProps {
  event: Event;
  isSaved: boolean;
  user: User | null;
}

// FIX: Update definisi komponen untuk menerima semua props dari EventCardProps
export default function EventCard({ event, isSaved, user }: EventCardProps) {
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
      className="bg-white rounded-xl shadow-md flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
    >
      {/* FIX: Pindahkan SaveEventButton ke dalam div relative */}
      <div className="relative">
        <Link href={`/event/${event.slug}`} className="block">
          <div className="relative h-44 w-full">
            <Image
              src={event.image_url || "/hero-bg.jpg"}
              alt={`Poster for ${event.title}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
        <SaveEventButton
          eventId={event.id}
          isSavedInitial={isSaved}
          user={user}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <span className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full self-start mb-2">
          {event.category}
        </span>
        <h2 className="text-lg font-bold text-neutral-dark mb-3 line-clamp-2 flex-grow">
          <Link href={`/event/${event.slug}`}>{event.title}</Link>
        </h2>
        <div className="flex flex-col gap-2 mt-auto">
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
