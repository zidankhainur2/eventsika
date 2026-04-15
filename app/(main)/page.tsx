import { Suspense } from "react";
import CategoryFilters from "@/components/CategoryFilters";
import EventsView from "@/components/EventsView";
import HomePageSkeleton from "@/components/skeletons/HomePageSkeleton";
import Hero from "@/components/Hero";
import CtaSection from "@/components/CtaSection";
import WhyEventSika from "@/components/WhyEventSika";

export default async function HomePage() {
  return (
    <main className="min-h-screen pb-12 bg-[#fff8f6] dark:bg-background font-sans transition-colors duration-300">
      <Hero />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-20">
        <Suspense fallback={<HomePageSkeleton />}>
          {/* Filter Section (Sticky effect diadaptasi) */}
          <div className="sticky top-16 z-40 py-6 bg-[#fff8f6]/95 dark:bg-background/95 backdrop-blur-md border-b border-stone-200 dark:border-border mb-10">
            <CategoryFilters />
          </div>

          <div id="events" className="scroll-mt-32">
            <EventsView />
          </div>
        </Suspense>
      </div>

      <div className="mt-24 px-6 md:px-12 max-w-7xl mx-auto">
        <WhyEventSika />
      </div>

      <div className="mt-24 mb-10 px-6 md:px-12">
        <CtaSection />
      </div>
    </main>
  );
}
