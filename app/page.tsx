// app/page.tsx
import SearchFilter from "@/components/SearchFilter";
import Hero from "@/components/Hero";
import {
  getRecommendedEvents,
  getMajorRelatedEvents,
  getAllUpcomingEvents,
} from "@/lib/supabase";
import EventCarousel from "@/components/EventCarousel";
import AnimatedEventGrid from "@/components/AnimatedEventGrid";
import { createClient } from "@/utils/supabase/server";

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Ambil data untuk semua section secara paralel
  const [recommendedEvents, majorRelatedEvents, allUpcomingEvents] =
    await Promise.all([
      getRecommendedEvents(supabase, user),
      getMajorRelatedEvents(supabase, user),
      getAllUpcomingEvents(supabase),
    ]);

  return (
    <main className="min-h-screen py-8 sm:py-12">
      <Hero />
      <div className="mt-12">
        <SearchFilter />
      </div>

      <div id="events" className="mt-12 space-y-8">
        {/* Carousel 1: Rekomendasi */}
        <EventCarousel title="Rekomendasi Untukmu" events={recommendedEvents} />

        {/* Carousel 2: Terkait Jurusan */}
        <EventCarousel title="Terkait Jurusanmu" events={majorRelatedEvents} />

        {/* Bagian 3: Semua Event */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            Semua Event Mendatang
          </h2>
          {allUpcomingEvents.length > 0 ? (
            <AnimatedEventGrid events={allUpcomingEvents} />
          ) : (
            <div className="text-center bg-white p-8 rounded-lg shadow-md">
              <p className="text-2xl mb-4">👀</p>
              <p className="font-semibold text-neutral-dark mb-2">
                Belum ada event mendatang.
              </p>
              <p className="text-sm text-gray-500">
                Cek kembali nanti atau submit eventmu sendiri!
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
