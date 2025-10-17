"use client";

import { useSearchParams } from "next/navigation";
import { useEvents } from "@/lib/hooks/useEvents";
import Link from "next/link";

import EventCarousel from "@/components/EventCarousel";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/Button";
import HomePageSkeleton from "./skeletons/HomePageSkeleton";

export default function EventsView() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  const {
    user,
    upcomingEvents,
    recommendedEvents,
    majorEvents,
    savedEventIds,
    isLoading,
    error,
  } = useEvents(search, category);

  const isSearching = search || category;

  if (isLoading) {
    return <HomePageSkeleton />;
  }

  if (error) {
    return (
      <EmptyState
        title="Oops! Terjadi Kesalahan"
        message="Tidak dapat memuat data event. Coba muat ulang halaman."
      />
    );
  }

  const normalizedUser = user ?? null;

  return (
    <div className="mt-4 space-y-8">
      <EventCarousel
        title="Rekomendasi Untukmu"
        events={recommendedEvents}
        viewAllLink="/events/recommended"
        savedEventIds={savedEventIds}
        user={normalizedUser}
      />
      <EventCarousel
        title="Terkait Jurusanmu"
        events={majorEvents}
        viewAllLink="/events/major"
        savedEventIds={savedEventIds}
        user={normalizedUser}
      />
      <section>
        {upcomingEvents.length > 0 ? (
          <EventCarousel
            title="Semua Event Mendatang"
            events={upcomingEvents}
            viewAllLink="/events/upcoming"
            savedEventIds={savedEventIds}
            user={normalizedUser}
          />
        ) : isSearching ? (
          <EmptyState
            title="Event Tidak Ditemukan"
            message="Coba gunakan kata kunci atau filter yang berbeda."
          />
        ) : (
          <EmptyState
            title="Belum Ada Event Mendatang"
            message="Saat ini belum ada event yang dijadwalkan. Cek kembali nanti!"
          >
            <Link href="/submit-event">
              <Button variant="accent">Submit Event</Button>
            </Link>
          </EmptyState>
        )}
      </section>
    </div>
  );
}
