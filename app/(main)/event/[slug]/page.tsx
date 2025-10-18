"use client";

import Image from "next/image";
import { FaCalendarAlt, FaMapMarkerAlt, FaUserFriends } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

import StickyRegisterButton from "@/components/StickyRegisterButton";
import SaveEventButton from "@/components/SaveEventButton";
import RegisterButton from "@/components/RegisterButton";
import { useEventBySlug } from "@/lib/hooks/useEvents";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import ShareDialog from "@/components/ShareDialog";
import EventCard from "@/components/EventCard";
import Breadcrumb from "@/components/Breadcrumb";

function InfoItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="flex items-center gap-3 font-semibold text-neutral-dark mb-1">
        <span className="text-primary">{icon}</span>
        <span>{label}</span>
      </h3>
      <p className="text-gray-700 pl-8">{children}</p>
    </div>
  );
}

// Skeleton baru untuk layout 2 kolom
function EventDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto animate-pulse">
      <div className="w-full h-60 sm:h-96 rounded-xl bg-gray-200 mb-8"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-6 w-1/4 bg-gray-200 rounded-full"></div>
          <div className="h-10 w-3/4 bg-gray-200 rounded-md"></div>
          <div className="flex gap-4">
            <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
          </div>
          <div className="h-6 w-1/3 bg-gray-200 rounded-md mt-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded-md"></div>
            <div className="h-4 bg-gray-200 rounded-md"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded-md"></div>
          </div>
          {/* Skeleton untuk "Kamu Mungkin Suka" dipindahkan ke sini */}
          <div className="pt-10">
            <div className="h-8 w-1/3 bg-gray-200 rounded-md mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-72 bg-gray-100 rounded-xl"></div>
              <div className="h-72 bg-gray-100 rounded-xl"></div>
            </div>
          </div>
        </div>
        <aside className="lg:col-span-1">
          <div className="bg-gray-100 p-6 rounded-xl sticky top-24">
            <div className="h-8 w-1/2 bg-gray-200 rounded-md mb-6"></div>
            <div className="space-y-5">
              <div className="h-12 bg-gray-200 rounded-md"></div>
              <div className="h-12 bg-gray-200 rounded-md"></div>
            </div>
            <div className="h-12 w-full bg-gray-200 rounded-md mt-8"></div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function EventDetailPage() {
  const params = useParams();
  const pathname = usePathname();
  const slug = params.slug as string | null;
  const eventUrl = `${
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  }${pathname}`;

  const { event, user, isSaved, relatedEvents, isLoading, error } =
    useEventBySlug(slug);

  if (isLoading) {
    return (
      <main className="py-8 sm:py-12">
        <EventDetailSkeleton />
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="py-8 sm:py-12">
        <EmptyState
          title="Event Tidak Ditemukan"
          message="Maaf, kami tidak dapat menemukan event yang Anda cari."
        />
      </main>
    );
  }

  const normalizedUser = user ?? null;

  return (
    <>
      <main className="py-8 sm:py-12">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: event.title }]}
        />
        <div className="max-w-5xl mx-auto">
          {/* Bagian Gambar Utama */}
          <div className="relative w-full h-60 sm:h-96 rounded-xl overflow-hidden shadow-lg mb-8">
            <Image
              src={event.image_url || "/hero-bg.webp"}
              alt={`Poster for ${event.title}`}
              fill
              className="object-cover"
              priority
            />
            <SaveEventButton
              eventId={event.id}
              isSavedInitial={isSaved}
              user={normalizedUser}
            />
          </div>

          {/* Layout Dua Kolom */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Kolom Kiri: Konten Utama */}
            <div className="lg:col-span-2">
              <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                {event.category}
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary my-4">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 my-6">
                <Button variant="outline" size="sm" className="gap-2" disabled>
                  <FiCalendar className="h-4 w-4" />
                  Tambah ke Kalender
                </Button>
                <ShareDialog eventTitle={event.title} eventUrl={eventUrl} />
              </div>

              <h2 className="font-heading text-xl font-semibold text-text-primary mb-2 mt-10 border-b pb-2">
                Deskripsi Event
              </h2>
              <p className="text-text-secondary whitespace-pre-wrap leading-relaxed mt-4">
                {event.description}
              </p>

              {/* Seksi "Kamu Mungkin Suka" dipindahkan ke sini */}
              {relatedEvents.length > 0 && (
                <div className="mt-16">
                  <h3 className="font-heading text-2xl font-bold mb-6">
                    Kamu Mungkin Suka
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {relatedEvents.map((relatedEvent) => (
                      <EventCard
                        key={relatedEvent.id}
                        event={relatedEvent}
                        isSaved={isSaved}
                        user={normalizedUser}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Kolom Kanan: Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-surface p-6 rounded-xl shadow-md sticky top-24 border">
                <h2 className="font-heading text-xl font-bold text-primary mb-6">
                  Detail Informasi
                </h2>
                <div className="space-y-5">
                  <InfoItem icon={<FaCalendarAlt />} label="Tanggal & Waktu">
                    {new Date(event.event_date).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    WIB
                  </InfoItem>
                  <InfoItem icon={<FaMapMarkerAlt />} label="Lokasi">
                    {event.location}
                  </InfoItem>
                  <InfoItem icon={<FaUserFriends />} label="Penyelenggara">
                    {event.organizer}
                  </InfoItem>
                </div>
                <div className="mt-8">
                  <RegisterButton
                    link={event.registration_link}
                    user={normalizedUser}
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <StickyRegisterButton
        link={event.registration_link}
        user={normalizedUser}
      />
    </>
  );
}
