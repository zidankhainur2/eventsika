// src/app/page.tsx
import { createClient } from "@/utils/supabase/server";
import SearchFilter from "@/components/SearchFilter"; // Impor komponen baru

// ... (Tipe Event tetap sama)
type Event = {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  organizer: string;
  category: string;
};

// Terima searchParams sebagai prop
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

  const interests: string[] =
    user?.user_metadata.interests
      ?.split(",")
      .map((item: string) => item.trim()) || [];

  let query = supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  // Cek apakah ada personalisasi
  let isPersonalized = false;
  if (
    interests.length > 0 &&
    !searchParams?.search &&
    !searchParams?.category
  ) {
    const interestFilter = interests
      .map((interest) => `category.ilike.%${interest}%`)
      .join(",");
    query = query.or(interestFilter);
    isPersonalized = true;
  }

  // Terapkan filter pencarian jika ada
  if (searchParams?.search) {
    query = query.ilike("title", `%${searchParams.search}%`);
  }

  // Terapkan filter kategori jika ada
  if (searchParams?.category) {
    query = query.eq("category", searchParams.category);
  }

  const { data: events, error } = await query;

  if (error) {
    return <p>Gagal memuat event: {error.message}</p>;
  }

  const pageTitle = isPersonalized
    ? "Event Pilihan Untukmu"
    : "Event Kampus Terbaru";

  return (
    <main className="bg-neutral-light min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-6">{pageTitle}</h1>

        {/* Tambahkan komponen SearchFilter di sini */}
        <SearchFilter />

        {/* ... (Sisa kode untuk menampilkan pesan kosong dan daftar event tetap sama) ... */}
        {(!events || events.length === 0) && (
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <p className="text-neutral-dark">
              {isPersonalized
                ? "Oops! Belum ada event yang cocok dengan minatmu."
                : "Tidak ada event yang cocok dengan pencarianmu."}
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events &&
            events.map((event: Event) => (
              <div
                key={event.id}
                className="bg-neutral-white rounded-lg shadow-md p-5 flex flex-col"
              >
                {/* ... Kartu event tidak berubah ... */}
                <h2 className="text-xl font-semibold text-neutral-dark mb-2">
                  {event.title}
                </h2>
                <p className="text-sm text-gray-500 mb-1">
                  Penyelenggara:{" "}
                  <span className="font-medium text-primary">
                    {event.organizer}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Lokasi: <span className="font-medium">{event.location}</span>
                </p>
                <p className="text-neutral-dark text-sm mb-4 flex-grow">
                  {event.description.substring(0, 100)}...
                </p>
                <a
                  href={`/event/${event.id}`}
                  className="mt-auto bg-accent text-white font-bold py-2 px-4 rounded-md text-center hover:bg-orange-600 transition-colors"
                >
                  Lihat Detail
                </a>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}
