// components/EventCard.tsx
import Link from "next/link";
import { type Event } from "@/lib/types";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 flex flex-col transition-transform hover:scale-105">
      <h2 className="text-xl font-semibold text-neutral-dark mb-2 line-clamp-2">
        {event.title}
      </h2>
      <p className="text-sm text-gray-500 mb-1">
        Penyelenggara:{" "}
        <span className="font-medium text-primary">{event.organizer}</span>
      </p>
      <p className="text-sm text-gray-500 mb-4">
        Lokasi: <span className="font-medium">{event.location}</span>
      </p>
      <p className="text-neutral-dark text-sm mb-4 flex-grow line-clamp-3">
        {event.description}
      </p>
      <Link
        href={`/event/${event.id}`}
        className="mt-auto bg-accent text-white font-bold py-2 px-4 rounded-md text-center hover:bg-orange-600 transition-colors"
      >
        Lihat Detail
      </Link>
    </div>
  );
}
