// components/EventCarousel.tsx
import { type Event } from "@/lib/types";
import EventCard from "./EventCard";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

interface EventCarouselProps {
  title: string;
  events: Event[];
  viewAllLink?: string;
}

export default function EventCarousel({
  title,
  events,
  viewAllLink = "#events",
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
        {/* Tampilkan link "Lihat Semua" di desktop jika event melebihi batas */}
        {events.length > desktopLimit && (
          <Link
            href={viewAllLink}
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Lihat Semua <FiArrowRight />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:flex sm:gap-6 sm:overflow-x-auto sm:pb-4">
        {events.slice(0, desktopLimit).map((event, index) => (
          <div
            key={event.id}
            className={`w-full flex-shrink-0 sm:w-72 ${
              index >= mobileLimit ? "hidden sm:block" : ""
            }`}
          >
            <EventCard event={event} />
          </div>
        ))}
      </div>

      {/* Tombol "Lihat Semua" khusus untuk mobile */}
      {events.length > mobileLimit && (
        <div className="mt-6 sm:hidden text-center">
          <Link
            href={viewAllLink}
            className="inline-block w-full max-w-xs mx-auto px-6 py-3 rounded-lg font-bold transition-colors shadow-md bg-gray-100 hover:bg-gray-200 text-neutral-dark"
          >
            Lihat Semua
          </Link>
        </div>
      )}
    </section>
  );
}
