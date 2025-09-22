// components/EventCarousel.tsx
import { type Event } from "@/lib/types";
import EventCard from "./EventCard";

interface EventCarouselProps {
  title: string;
  events: Event[];
}

export default function EventCarousel({ title, events }: EventCarouselProps) {
  if (!events || events.length === 0) {
    return null; // Jangan tampilkan apa-apa jika tidak ada event
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-primary mb-4">{title}</h2>
      <div className="flex gap-6 overflow-x-auto pb-4 -mb-4">
        {events.map((event) => (
          <div key={event.id} className="w-72 flex-shrink-0">
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </section>
  );
}
