// src/app/event/[id]/page.tsx
import { getEventById } from "@/lib/supabase";
import Image from "next/image";
import { FaCalendarAlt, FaMapMarkerAlt, FaUserFriends } from "react-icons/fa";
import StickyRegisterButton from "@/components/StickyRegisterButton";
import { createClient } from "@/utils/supabase/server";
import SaveEventButton from "@/components/SaveEventButton";

type EventDetailPageProps = {
  params: { id: string };
};

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

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const event = await getEventById(params.id);

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isSaved = false;
  if (user) {
    // Cek apakah event ini ada di tabel saved_events untuk user ini
    const { data: savedEventData } = await supabase
      .from("saved_events")
      .select("id")
      .match({ user_id: user.id, event_id: params.id })
      .single(); // .single() untuk ambil satu baris saja

    isSaved = !!savedEventData; // Jika ada data, isSaved menjadi true
  }

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
                user={user}
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
                  <a
                    href={event.registration_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center block bg-accent text-on-accent font-bold py-3 px-10 rounded-lg text-lg hover:bg-yellow-500 transition-colors"
                  >
                    Daftar Sekarang
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <StickyRegisterButton link={event.registration_link} />
    </>
  );
}
