import { createClient } from "@/utils/supabase/server";
import { getMajorRelatedEvents } from "@/lib/supabase";
import AnimatedEventGrid from "@/components/AnimatedEventGrid";
import { EmptyState } from "@/components/EmptyState";
import Breadcrumb from "@/components/Breadcrumb";

export default async function MajorRelatedEventsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const events = await getMajorRelatedEvents(supabase, user);

  return (
    <main className="min-h-screen py-8 sm:py-12">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Terkait Jurusan" }]}
      />
      <h1 className="text-3xl font-bold text-primary mb-8">
        Event Terkait Jurusanmu
      </h1>
      {events.length > 0 ? (
        <AnimatedEventGrid events={events} />
      ) : (
        <EmptyState
          title="Tidak Ada Event Terkait Jurusan"
          message="Saat ini tidak ada event yang relevan dengan jurusan Anda."
        />
      )}
    </main>
  );
}
