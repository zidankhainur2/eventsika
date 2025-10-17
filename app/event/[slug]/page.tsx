"use client";

import Image from "next/image";
import { FaCalendarAlt, FaMapMarkerAlt, FaUserFriends } from "react-icons/fa";
import StickyRegisterButton from "@/components/StickyRegisterButton";
import SaveEventButton from "@/components/SaveEventButton";
import RegisterButton from "@/components/RegisterButton";
import { useParams } from "next/navigation";
import { useEventBySlug } from "@/lib/hooks/useEvents";
import { EmptyState } from "@/components/EmptyState";

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

function EventDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto animate-pulse">
      <div className="relative w-full h-60 sm:h-96 rounded-xl bg-gray-200 mb-8"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-xl shadow-md">
          <div className="h-6 w-1/4 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-10 w-3/4 bg-gray-200 rounded-md mb-8"></div>
          <div className="h-6 w-1/3 bg-gray-200 rounded-md mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded-md"></div>
            <div className="h-4 bg-gray-200 rounded-md"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded-md"></div>
          </div>
        </div>
        <aside className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-md sticky top-24">
            <div className="h-8 w-1/2 bg-gray-200 rounded-md mb-6"></div>
            <div className="space-y-5">
              <div className="h-12 bg-gray-200 rounded-md"></div>
              <div className="h-12 bg-gray-200 rounded-md"></div>
              <div className="h-12 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function EventDetailPage() {
  const params = useParams();
  const slug = params.slug as string | null;

  const { event, user, isSaved, isLoading, error } = useEventBySlug(slug);

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
        <div className="max-w-5xl mx-auto">
          <div className="relative w-full h-60 sm:h-96 rounded-xl overflow-hidden shadow-lg mb-8">
            <Image
              src={event.image_url || "/hero-background.jpg"}
              alt={`Poster for ${event.title}`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-4 right-4 z-10">
              <SaveEventButton
                eventId={event.id}
                isSavedInitial={isSaved}
                user={normalizedUser}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-xl shadow-md">
              <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                {event.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-neutral-dark my-4">
                {event.title}
              </h1>
              <h2 className="text-xl font-semibold text-neutral-dark mb-2 mt-8">
                Deskripsi Event
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {event.description}
              </p>
            </div>

            <aside className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-md sticky top-24">
                <h2 className="text-xl font-bold text-primary mb-6">
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
                <div className="mt-8 hidden lg:block">
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
