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

  const mobileLimit = 4;
  const desktopLimit = 5;

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-primary">{title}</h2>
        {viewAllLink && events.length > desktopLimit && (
          <Link
            href={viewAllLink}
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Lihat Semua <FiArrowRight />
          </Link>
        )}
      </div>

      {/* Mobile Version */}
      <div className="block sm:hidden">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {events.slice(0, mobileLimit).map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isSaved={savedEventIds.has(event.id)}
              user={user}
            />
          ))}
        </div>

        {viewAllLink && events.length > mobileLimit && (
          <div className="text-center">
            <Link
              href={viewAllLink}
              className="bg-accent text-on-accent px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-all duration-200 inline-block"
            >
              Lihat Semua Event
            </Link>
          </div>
        )}
      </div>

      {/* Desktop Version */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {events.slice(0, desktopLimit).map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isSaved={savedEventIds.has(event.id)}
              user={user}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
