import { getAllUpcomingEvents } from "@/lib/supabase";
import AnimatedEventGrid from "@/components/AnimatedEventGrid";
import { EmptyState } from "@/components/EmptyState";
import Breadcrumb from "@/components/Breadcrumb";
import { createClient } from "@/utils/supabase/server";

export default async function UpcomingEventsPage({
  searchParams,
}: {
  searchParams?: {
    search?: string;
    category?: string;
  };
}) {
  const supabase = createClient();
  const search = searchParams?.search || "";
  const category = searchParams?.category || "";
  const events = await getAllUpcomingEvents(supabase, { search, category });

  return (
    <main className="min-h-screen py-8 sm:py-12">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Event Mendatang" }]}
      />
      <h1 className="text-3xl font-bold text-primary mb-8">
        Semua Event Mendatang
      </h1>
      {events.length > 0 ? (
        <AnimatedEventGrid events={events} />
      ) : (
        <EmptyState
          title="Tidak Ada Event"
          message="Tidak ada event mendatang yang ditemukan."
        />
      )}
    </main>
  );
}
