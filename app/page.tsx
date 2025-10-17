import { Suspense } from "react";
import EventBannerCarousel from "@/components/EventBannerCarousel";
import CategoryFilters from "@/components/CategoryFilters";
import EventsView from "@/components/EventsView";
import HomePageSkeleton from "@/components/skeletons/HomePageSkeleton";
import { getAllUpcomingEvents } from "@/lib/supabase";
import { createClient } from "@/utils/supabase/server";

export default async function HomePage() {
  const supabase = createClient();
  const bannerEvents = await getAllUpcomingEvents(supabase, { limit: 5 });

  return (
    <main className="min-h-screen py-8 sm:py-12">
      <EventBannerCarousel events={bannerEvents} />

      <Suspense fallback={<HomePageSkeleton />}>
        <CategoryFilters />
        <div id="events">
          <EventsView />
        </div>
      </Suspense>
    </main>
  );
}
