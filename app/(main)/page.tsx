import { Suspense } from "react";
import HeroSection from "@/components/home/HeroSection";
import RecommendationSection from "@/components/home/RecommendationSection";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import EventGridSkeleton from "@/components/shared/EventGridSkeleton";
import CategoryCard from "@/components/ui/category-card";

export const revalidate = 3600; // Cache invalidation strategy per jam (jika relevan)

const categoriesList = [
  { key: "seminar", label: "Seminar" },
  { key: "workshop", label: "Workshop" },
  { key: "kompetisi", label: "Kompetisi" },
  { key: "seni-budaya", label: "Seni & Budaya" },
  { key: "olahraga", label: "Olahraga" },
  { key: "teknologi", label: "Teknologi" },
  { key: "pengembangan-diri", label: "Pengembangan Diri" },
  { key: "sosial", label: "Sosial & Komunitas" }
];

export default function HomePage() {
  return (
    <div className="flex flex-col bg-white">
      <HeroSection />
      
      {/* Section Rekomendasi - Tampil personal untuk Student jika login */}
      <Suspense fallback={null}>
        <RecommendationSection />
      </Suspense>

      {/* Section Kategori — off-white bg */}
      <section className="bg-[#F7F7F5] py-16 border-b-2 border-[#0A0A0A] px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-[#0A0A0A]">
            Jelajahi Kategori
          </h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
            {categoriesList.map((cat) => (
              <CategoryCard 
                key={cat.key} 
                categoryKey={cat.key} 
                label={cat.label} 
                href={`/explore?category=${encodeURIComponent(cat.label)}`} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section Upcoming Events — white bg */}
      <section className="bg-white py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-[#0A0A0A]">
            Event Terbaru
          </h2>

          <Suspense fallback={<EventGridSkeleton count={8} />}>
            <UpcomingEvents />
          </Suspense>
        </div>
      </section>
    </div>
  );
}