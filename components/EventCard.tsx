"use client";

import Link from "next/link";
import Image from "next/image";
import { type Event } from "@/lib/types";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import SaveEventButton from "./SaveEventButton";
import { type User } from "@supabase/supabase-js";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  event: Event;
  isSaved: boolean;
  user: User | null;
}

export default function EventCard({ event, isSaved, user }: EventCardProps) {
  const eventDate = new Date(event.event_date);

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group border-border">
      <CardHeader className="p-0 relative">
        <Link href={`/event/${event.slug}`} className="block aspect-[4/3]">
          <Image
            src={event.image_url || "/hero-bg.webp"}
            alt={`Poster for ${event.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="absolute top-3 right-3">
          <SaveEventButton
            eventId={event.id}
            isSavedInitial={isSaved}
            user={user}
          />
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-grow">
        <Badge variant="secondary" className="mb-2">
          {event.category}
        </Badge>
        <CardTitle className="font-heading text-lg leading-snug line-clamp-2">
          <Link
            href={`/event/${event.slug}`}
            className="hover:text-primary transition-colors"
          >
            {event.title}
          </Link>
        </CardTitle>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-2 p-4 pt-0">
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <FaCalendarAlt className="h-3 w-3 text-gray-400" />
          <span>
            {eventDate.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <FaMapMarkerAlt className="h-3 w-3 text-gray-400" />
          <span className="truncate">{event.location}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
