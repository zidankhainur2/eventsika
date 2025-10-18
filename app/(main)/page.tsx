import { Suspense } from "react";
import CategoryFilters from "@/components/CategoryFilters";
import EventsView from "@/components/EventsView";
import HomePageSkeleton from "@/components/skeletons/HomePageSkeleton";
import Hero from "@/components/Hero";
import CtaSection from "@/components/CtaSection";
import WhyEventSika from "@/components/WhyEventSika";

export default async function HomePage() {
  return (
    <main className="min-h-screen py-8 sm:py-12">
      <Hero />
      <Suspense fallback={<HomePageSkeleton />}>
        <div className="max-w-6xl mx-auto px-4">
          <CategoryFilters />
          <div id="events">
            <EventsView />
          </div>
        </div>
      </Suspense>
      <CtaSection />
      <WhyEventSika />
    </main>
  );
}
