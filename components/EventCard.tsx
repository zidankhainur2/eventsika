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
      <div className="bg-white dark:bg-card rounded-2xl overflow-hidden border border-gray-100 dark:border-border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full relative">
        {/* Gambar & Badges */}
        <div className="h-48 overflow-hidden relative">
          <Link href={`/event/${event.slug}`} className="block w-full h-full">
            <Image
              src={event.image_url || "/hero-bg.webp"}
              alt={event.title}
              fill
              sizes="(max-width: 640px) 100vw, 300px"
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </Link>

          {/* Badge Kategori Melayang Kiri */}
          <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
            {categoryTag}
          </span>

          {/* Tombol Bookmark Kanan */}
          <div className="absolute top-2 right-2 bg-white/80 dark:bg-black/50 backdrop-blur rounded-full p-1 shadow-sm">
            <SaveEventButton
              eventId={event.id}
              isSavedInitial={isSaved}
              user={user}
            />
          </div>
        </div>

        {/* Konten Detail */}
        <div className="p-5 flex flex-col flex-grow justify-between gap-4">
          <div className="space-y-2">
            <Link href={`/event/${event.slug}`}>
              <h3 className="font-bold text-lg leading-tight text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                {event.title}
              </h3>
            </Link>
          </div>

          <div className="flex items-end justify-between mt-auto border-t border-gray-50 dark:border-border/50 pt-3">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              <FaCalendarAlt className="text-primary/60" />
              <span>{formatEventDateStr(event.start_date)}</span>
            </div>

            {/* Tampilan Harga/Status (Bisa disesuaikan logicnya dengan data DB) */}
            <span className="text-primary font-bold text-sm">Cek Detail</span>
          </div>
        </div>
      </div>
    </div>
  );
}
