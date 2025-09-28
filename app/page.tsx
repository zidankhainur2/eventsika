import Hero from "@/components/Hero";
import {
  getRecommendedEvents,
  getMajorRelatedEvents,
  getAllUpcomingEvents,
} from "@/lib/supabase";
import EventCarousel from "@/components/EventCarousel";
import { createClient } from "@/utils/supabase/server";
import { EmptyState } from "@/components/EmptyState";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: {
    search?: string;
    category?: string;
  };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const search = searchParams?.search || "";
  const category = searchParams?.category || "";

  const [recommendedEvents, majorRelatedEvents, allUpcomingEvents] =
    await Promise.all([
      getRecommendedEvents(supabase, user),
      getMajorRelatedEvents(supabase, user),
      getAllUpcomingEvents(supabase, { search, category }),
    ]);

  const isSearching = search || category;

  return (
    <main className="min-h-screen py-8 sm:py-12">
      <Hero />
      <div id="events" className="mt-12 space-y-8">
        <EventCarousel
          title="Rekomendasi Untukmu"
          events={recommendedEvents}
          viewAllLink="/events/recommended"
        />

        <EventCarousel
          title="Terkait Jurusanmu"
          events={majorRelatedEvents}
          viewAllLink="/events/major"
        />

        <section>
          {allUpcomingEvents.length > 0 ? (
            <EventCarousel
              title="Semua Event Mendatang"
              events={allUpcomingEvents}
              viewAllLink="/events/upcoming"
            />
          ) : isSearching ? (
            <EmptyState
              title="Event Tidak Ditemukan"
              message="Coba gunakan kata kunci atau filter yang berbeda untuk menemukan apa yang Anda cari."
            />
          ) : (
            <EmptyState
              title="Belum Ada Event Mendatang"
              message="Saat ini belum ada event yang dijadwalkan. Cek kembali nanti atau submit event Anda sendiri!"
            >
              <Button variant="accent" className="max-w-xs mx-auto">
                <Link href="/submit-event">Submit Event</Link>
              </Button>
            </EmptyState>
          )}
        </section>
      </div>
    </main>
  );
}
