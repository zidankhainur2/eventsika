"use client";

import Link from "next/link";
import { FiPlusSquare } from "react-icons/fi";
import { Card } from "@/components/ui/card";
import Breadcrumb from "@/components/Breadcrumb";
import { useOrganizerEvents } from "@/lib/hooks/useEvents";

function DashboardSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 h-20"
        >
          <div className="space-y-2">
            <div className="h-5 w-48 bg-gray-200 rounded-md"></div>
            <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-5 w-12 bg-gray-200 rounded-md"></div>
            <div className="h-5 w-12 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OrganizerDashboard() {
  const { events, isLoading, error } = useOrganizerEvents();

  return (
    <main className="min-h-screen py-8 sm:py-12">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Dasbor Organizer" }]}
      />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Dasbor Organizer</h1>
        <Link
          href="/submit-event"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-on-accent font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
        >
          <FiPlusSquare />
          <span>Buat Event Baru</span>
        </Link>
      </div>

      <Card>
        <h2 className="text-xl font-semibold text-neutral-dark mb-4">
          Event yang Anda Kelola
        </h2>
        {isLoading ? (
          <DashboardSkeleton />
        ) : error ? (
          <p className="text-red-500 text-center py-8">
            Gagal memuat event: {error.message}
          </p>
        ) : events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-bold text-neutral-dark">{event.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(event.event_date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/event/${event.slug}`}
                    className="text-sm font-medium text-gray-600 hover:text-primary"
                  >
                    Lihat
                  </Link>
                  <Link
                    href={`/event/${event.slug}/edit`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            Anda belum membuat event apapun.
          </p>
        )}
      </Card>
    </main>
  );
}
