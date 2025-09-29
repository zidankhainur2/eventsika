import { createClient } from "@/utils/supabase/server";
import { getSavedEvents } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import Breadcrumb from "@/components/Breadcrumb";
import { FiHeart } from "react-icons/fi";
import Link from "next/link";
import SavedEventsGrid from "./SavedEventsGrid";

export default async function SavedEventsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const events = await getSavedEvents(supabase, user);

  return (
    <main className="min-h-screen py-8 sm:py-12">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Profil", href: "/profile" },
          { label: "Event Tersimpan" },
        ]}
      />
      <h1 className="text-3xl font-bold text-primary mb-8">Event Tersimpan</h1>
      {events.length > 0 ? (
        <SavedEventsGrid events={events} user={user} />
      ) : (
        <EmptyState
          icon={<FiHeart className="h-16 w-16 text-gray-400" />}
          title="Belum Ada Event Tersimpan"
          message="Anda belum menyimpan event apapun. Mulai jelajahi dan simpan event yang Anda minati!"
        >
          <Link
            href="/"
            className="mt-4 inline-block bg-accent text-on-accent px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-all duration-200"
          >
            Cari Event Sekarang
          </Link>
        </EmptyState>
      )}
    </main>
  );
}
