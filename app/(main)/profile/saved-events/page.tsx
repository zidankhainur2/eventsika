"use client";

import { redirect } from "next/navigation";
import Link from "next/link";
import { FiHeart } from "react-icons/fi";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import SavedEventsGrid from "./SavedEventsGrid";
import { useSavedEvents } from "@/lib/hooks/useEvents";

function SavedEventsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl bg-gray-100 h-80"></div>
      ))}
    </div>
  );
}

export default function SavedEventsPage() {
  const { events, user, isLoading, error } = useSavedEvents();

  if (!isLoading && !user) {
    redirect("/login");
  }

  const normalizedUser = user ?? null;

  return (
    <div>
      <div className="p-6 sm:p-8">
        <h1 className="text-2xl font-heading font-bold text-text-primary">
          Event Tersimpan
        </h1>
        <p className="text-text-secondary mt-1">
          Semua event yang kamu tandai untuk dilihat nanti.
        </p>
      </div>
      <div className="p-6 sm:p-8 border-t">
        {isLoading ? (
          <SavedEventsSkeleton />
        ) : error ? (
          <p className="text-center text-destructive">Gagal memuat event.</p>
        ) : events.length > 0 ? (
          <SavedEventsGrid events={events} user={normalizedUser} />
        ) : (
          <EmptyState
            icon={<FiHeart className="h-16 w-16 text-gray-400" />}
            title="Belum Ada Event Tersimpan"
            message="Kamu belum menyimpan event apapun. Mulai jelajahi dan simpan event yang kamu minati!"
          >
            <Button asChild className="mt-6">
              <Link href="/">Cari Event Sekarang</Link>
            </Button>
          </EmptyState>
        )}
      </div>
    </div>
  );
}
