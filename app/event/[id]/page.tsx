// src/app/event/[id]/page.tsx
import { getEventById } from "@/lib/supabase";

type EventDetailPageProps = {
  params: { id: string };
};

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const event = await getEventById(params.id);

  return (
    <main className="bg-neutral-light min-h-screen p-4 sm:p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
        <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
          {event.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-dark my-4">
          {event.title}
        </h1>
        <p className="text-gray-600 mb-6">
          Diselenggarakan oleh{" "}
          <span className="font-bold text-primary">{event.organizer}</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 border-t border-b border-gray-200 py-4 mb-6">
          <div className="flex-1">
            <h3 className="font-semibold text-neutral-dark mb-1">Waktu</h3>
            <p className="text-gray-700">
              {new Date(event.event_date).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              WIB
            </p>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-neutral-dark mb-1">Lokasi</h3>
            <p className="text-gray-700">{event.location}</p>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-neutral-dark mb-2">
          Deskripsi Event
        </h2>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {event.description}
        </p>
        <div className="mt-8 text-center">
          <a
            href={event.registration_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-accent text-white font-bold py-3 px-10 rounded-lg text-lg hover:bg-orange-600 transition-colors"
          >
            Daftar Sekarang
          </a>
        </div>
      </div>
    </main>
  );
}
