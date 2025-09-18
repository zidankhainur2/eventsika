// src/app/page.tsx
import SearchFilter from "@/components/SearchFilter";
import Hero from "@/components/Hero";
import { getEvents } from "@/lib/supabase";
import AnimatedEventGrid from "@/components/AnimatedEventGrid";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { search?: string; category?: string };
}) {
  // Pengambilan data kembali terjadi di Server Component
  const { events, pageTitle, isPersonalized } = await getEvents(searchParams);

  return (
    <main className="min-h-screen py-8 sm:py-12">
      <Hero />

      <section id="events" className="mt-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-3xl font-bold text-primary">{pageTitle}</h2>
        </div>

        <SearchFilter />

        {events.length === 0 ? (
          <div className="text-center bg-white p-8 rounded-lg shadow-md mt-6">
            <p className="text-2xl mb-4">😢</p>
            <p className="font-semibold text-neutral-dark mb-2">
              {isPersonalized
                ? "Oops! Belum ada event yang cocok."
                : "Tidak ada event ditemukan."}
            </p>
            <p className="text-sm text-gray-500">
              Coba ubah kata kunci pencarian atau filter kategorimu.
            </p>
          </div>
        ) : (
          // Panggil komponen client dan lewatkan data sebagai props
          <AnimatedEventGrid events={events} />
        )}
      </section>
    </main>
  );
}
