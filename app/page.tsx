// src/app/page.tsx
import SearchFilter from "@/components/SearchFilter";
import EventCard from "@/components/EventCard";
import { getEvents } from "@/lib/supabase";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { search?: string; category?: string };
}) {
  const { events, pageTitle, isPersonalized } = await getEvents(searchParams);

  return (
    <main className="bg-neutral-light min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-6">{pageTitle}</h1>
        <SearchFilter />

        {events.length === 0 ? (
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <p className="text-neutral-dark">
              {isPersonalized
                ? "Oops! Belum ada event yang cocok dengan minatmu."
                : "Tidak ada event yang cocok dengan pencarianmu."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
