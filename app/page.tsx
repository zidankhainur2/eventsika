"use client";

import EventCarousel from "@/components/EventCarousel";
import { EmptyState } from "@/components/EmptyState";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import EventBannerCarousel from "@/components/EventBannerCarousel";
import CategoryFilters from "@/components/CategoryFilters";
import { useSearchParams } from "next/navigation";
import { useEvents } from "@/lib/hooks/useEvents";
import { useEffect, useState } from "react";

function EventCarouselSkeleton() {
  return (
    <div className="mb-12">
      <div className="h-8 w-1/2 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="h-44 w-full bg-gray-200 animate-pulse"></div>
            <div className="p-4">
              <div className="h-4 w-1/4 bg-gray-200 rounded-md mb-2 animate-pulse"></div>
              <div className="h-6 w-full bg-gray-200 rounded-md mb-3 animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
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

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isSearching = search || category;
  const normalizedUser = user ?? null;

  if (error) {
    return (
      <EmptyState
        title="Oops! Terjadi Kesalahan"
        message="Tidak dapat memuat data event. Coba muat ulang halaman."
      />
    );
  }

  if (!mounted || isLoading) {
    return (
      <main className="min-h-screen py-8 sm:py-12">
        <div className="mb-8 h-64 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="mb-8 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        <div id="events" className="mt-4 space-y-8">
          <EventCarouselSkeleton />
          <EventCarouselSkeleton />
          <EventCarouselSkeleton />
        </div>
      </main>
    );
  }

  const bannerEvents = upcomingEvents.slice(0, 5);

  return (
    <main className="min-h-screen py-8 sm:py-12">
      <EventBannerCarousel events={bannerEvents} />
      <CategoryFilters />
      <div id="events" className="mt-4 space-y-8">
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
    </main>
  );
}
