"use client";

import Link from "next/link";
import Image from "next/image";
import { type Event } from "@/lib/types";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import SaveEventButton from "./SaveEventButton";
import { type User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const formatEventDate = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const startDay = startDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
  const endDay = endDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });

  // Jika hari dan bulan sama, tampilkan format: 5 Okt (09:00 - 15:00)
  if (startDay === endDay) {
    const startTime = startDate.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const endTime = endDate.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${startDay}, ${startTime} - ${endTime}`;
  }

  // Jika beda hari: 5 Okt - 7 Okt
  return `${startDay} - ${endDay}`;
};

interface EventCardProps {
  event: Event;
  isSaved: boolean;
  user: User | null;
}

export default function EventCard({ event, isSaved, user }: EventCardProps) {

  return (
    <div className="w-40 sm:w-full flex-shrink-0">
      <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 hover:bg-muted/80 group border-border">
        <CardHeader className="p-0 relative">
          <Link href={`/event/${event.slug}`} className="block aspect-square">
            <Image
              src={event.image_url || "/hero-bg.webp"}
              alt={`Poster for ${event.title}`}
              fill
              sizes="(max-width: 640px) 40vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
          <div className="absolute top-2 right-2">
            <SaveEventButton
              eventId={event.id}
              isSavedInitial={isSaved}
              user={user}
            />
          </div>
        </CardHeader>

        <CardContent className="p-3 flex-grow flex flex-col">
          <CardTitle className="font-heading text-base leading-snug line-clamp-2 mb-2">
            <Link
              href={`/event/${event.slug}`}
              className="hover:text-primary transition-colors"
            >
              {event.title}
            </Link>
          </CardTitle>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <FaCalendarAlt className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">
              {formatEventDate(event.start_date, event.end_date)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
