import { createClient } from "@/utils/supabase/server";
import { getVectorRecommendations } from "@/app/action"; // PERUBAHAN: Gunakan dari action.ts
import AnimatedEventGrid from "@/components/AnimatedEventGrid";
import { EmptyState } from "@/components/EmptyState";
import Breadcrumb from "@/components/Breadcrumb";
import { redirect } from "next/navigation";

export default async function RecommendedEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Buka Promise searchParams khas Next.js 15
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.search || "";
  const category = resolvedSearchParams?.category || "";

  // Ambil event menggunakan algoritma hybrid (0.8 Semantik, 0.2 Jurusan, threshold > 0.5)
  const events = await getVectorRecommendations(search, category);

  return (
    <main className="min-h-screen py-8 sm:py-12">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Rekomendasi" }]}
      />
      <h1 className="text-3xl font-bold text-primary mb-8">
        Rekomendasi Event Untukmu
      </h1>
      {events.length > 0 ? (
        <AnimatedEventGrid events={events} />
      ) : (
        <EmptyState
          title="Tidak Ada Rekomendasi"
          message="Kami tidak menemukan event yang cocok dengan minat Anda saat ini."
        />
      )}
    </main>
  );
}
