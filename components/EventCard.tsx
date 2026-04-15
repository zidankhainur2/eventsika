"use client";

import Link from "next/link";
import Image from "next/image";
import { type Event } from "@/lib/types";
import { FaCalendarAlt } from "react-icons/fa";
import SaveEventButton from "./SaveEventButton";
import { type User } from "@supabase/supabase-js";

const formatEventDateStr = (start: string) => {
  const date = new Date(start);
  return `${date.getDate()} ${date.toLocaleDateString("id-ID", { month: "short" })} • ${date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`;
};

interface EventCardProps {
  event: Event;
  isSaved: boolean;
  user: User | null;
}

export default function EventCard({ event, isSaved, user }: EventCardProps) {
  // Fallback category jika database belum punya kolom kategori spesifik
  const categoryTag = event.category || "EVENT KAMPUS";

  return (
    <div className="w-[280px] sm:w-full flex-shrink-0 group">
      <div className="bg-white dark:bg-card rounded-3xl overflow-hidden border border-stone-200 dark:border-border shadow-md shadow-stone-200/30 dark:shadow-none hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full relative">
        {/* Gambar & Badges */}
        <div className="h-48 overflow-hidden relative p-2">
          <Link
            href={`/event/${event.slug}`}
            className="block w-full h-full relative rounded-2xl overflow-hidden"
          >
            <Image
              src={event.image_url || "/hero-bg.webp"}
              alt={event.title}
              fill
              sizes="(max-width: 640px) 100vw, 300px"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </Link>

          {/* Badge Kategori Melayang Kiri */}
          <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-sm">
            {categoryTag}
          </span>

          {/* Tombol Bookmark Kanan */}
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/50 backdrop-blur-md rounded-full p-1 shadow-sm border border-stone-100 dark:border-stone-800">
            <SaveEventButton
              eventId={event.id}
              isSavedInitial={isSaved}
              user={user}
            />
          </div>
        </div>

        {/* Konten Detail */}
        <div className="p-5 flex flex-col flex-grow justify-between gap-4 pt-2">
          <div className="space-y-2">
            <Link href={`/event/${event.slug}`}>
              <h3 className="font-bold text-lg leading-snug text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                {event.title}
              </h3>
            </Link>
          </div>

          <div className="flex items-end justify-between mt-auto border-t border-stone-100 dark:border-border/50 pt-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 dark:text-stone-400">
              <FaCalendarAlt className="text-primary/70 text-sm" />
              <span>{formatEventDateStr(event.start_date)}</span>
            </div>
            <span className="text-primary font-bold text-sm bg-primary/5 px-3 py-1.5 rounded-lg">
              Detail
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
