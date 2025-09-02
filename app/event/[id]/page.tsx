// src/app/event/[id]/page.tsx
import { getEventById } from "@/lib/supabase";
import Image from "next/image";

type EventDetailPageProps = {
  params: { id: string };
};

function InfoItem({
  icon,
  label,
  children,
}: {
  icon: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="flex items-center gap-2 font-semibold text-neutral-dark mb-1">
        <span>{icon}</span>
        <span>{label}</span>
      </h3>
      <p className="text-gray-700 pl-7">{children}</p>
    </div>
  );
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const event = await getEventById(params.id);

  return (
    <main className="py-8 sm:py-12">
      <div className="max-w-5xl mx-auto">
        {/* Hero Image */}
        <div className="relative w-full h-60 sm:h-96 rounded-xl overflow-hidden shadow-lg mb-8">
          <Image
            src={event.image_url || "/placeholder.png"}
            alt={`Poster for ${event.title}`}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
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

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-md sticky top-24">
              <h2 className="text-xl font-bold text-primary mb-6">
                Detail Informasi
              </h2>
              <div className="space-y-5">
                <InfoItem icon="🗓️" label="Tanggal & Waktu">
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
                <InfoItem icon="📍" label="Lokasi">
                  {event.location}
                </InfoItem>
                <InfoItem icon="👤" label="Penyelenggara">
                  {event.organizer}
                </InfoItem>
              </div>
              <div className="mt-8">
                <a
                  href={event.registration_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center block bg-accent text-white font-bold py-3 px-10 rounded-lg text-lg hover:bg-orange-600 transition-colors"
                >
                  Daftar Sekarang
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
