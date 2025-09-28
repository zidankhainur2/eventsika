import { createClient } from "@/utils/supabase/server";
import { getRecommendedEvents } from "@/lib/supabase";
import AnimatedEventGrid from "@/components/AnimatedEventGrid";
import { EmptyState } from "@/components/EmptyState";
import Breadcrumb from "@/components/Breadcrumb";

export default async function RecommendedEventsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const events = await getRecommendedEvents(supabase, user);

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
