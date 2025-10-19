import { type Event } from "@/lib/types";
import EventCard from "./EventCard";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { type User } from "@supabase/supabase-js";

interface EventCarouselProps {
  title: string;
  events: Event[];
  viewAllLink?: string;
  savedEventIds: Set<string>;
  user: User | null;
}

export default function EventCarousel({
  title,
  events,
  viewAllLink,
  savedEventIds,
  user,
}: EventCarouselProps) {
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <section className="mb-10">
      <div className="flex justify-between items-baseline mb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-heading text-primary">
          {title}
        </h2>
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="text-sm font-semibold text-primary/80 hover:underline"
          >
            Lihat Semua
          </Link>
        )}
      </div>

      {/* Versi Mobile: Horizontal Scroll */}
      <div className="sm:hidden">
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isSaved={savedEventIds.has(event.id)}
              user={user}
            />
          ))}
        </div>
      </div>

      {/* Versi Desktop: Grid */}
      <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {events.slice(0, 5).map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isSaved={savedEventIds.has(event.id)}
            user={user}
          />
        ))}
      </div>
    </section>
  );
}
