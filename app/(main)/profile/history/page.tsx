import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { FiClock } from "react-icons/fi";
import Link from "next/link";

// Data placeholder untuk simulasi
const pastEvents = [
  {
    id: "1",
    slug: "seminar-teknologi-ai",
    title: "Seminar Teknologi AI Masa Depan",
    event_date: "2024-08-15T09:00:00.000Z",
  },
  {
    id: "2",
    slug: "workshop-desain-grafis",
    title: "Workshop Desain Grafis untuk Pemula",
    event_date: "2024-07-20T13:00:00.000Z",
  },
];

// Ganti ini menjadi `false` untuk melihat tampilan EmptyState
const hasHistory = true;

export default function HistoryPage() {
  return (
    <div>
      <div className="p-6 sm:p-8">
        <h1 className="text-2xl font-heading font-bold text-text-primary">
          Riwayat Event
        </h1>
        <p className="text-text-secondary mt-1">
          Daftar event yang telah kamu hadiri atau ikuti.
        </p>
      </div>

      <div className="p-6 sm:p-8 border-t">
        {hasHistory ? (
          <div className="space-y-4">
            {pastEvents.map((event) => (
              <div
                key={event.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-semibold text-text-primary">
                    {event.title}
                  </p>
                  <p className="text-sm text-text-secondary mt-1">
                    Diikuti pada:{" "}
                    {new Date(event.event_date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full sm:w-auto"
                >
                  <Link href={`/event/${event.slug}`}>Lihat Lagi</Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<FiClock className="h-16 w-16 text-gray-400" />}
            title="Riwayat Event Kosong"
            message="Kamu belum memiliki riwayat event. Ayo mulai jelajahi dan ikuti event seru!"
          >
            <Button asChild className="mt-6">
              <Link href="/">Cari Event</Link>
            </Button>
          </EmptyState>
        )}
      </div>
    </div>
  );
}
