"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserFriends,
  FaTags,
  FaGraduationCap,
} from "react-icons/fa";
import { FiCalendar, FiMaximize2, FiX } from "react-icons/fi";

// Import komponen bawaan aplikasi Anda
import StickyRegisterButton from "@/components/StickyRegisterButton";
import SaveEventButton from "@/components/SaveEventButton";
import RegisterButton from "@/components/RegisterButton";
import ShareDialog from "@/components/ShareDialog";
import Breadcrumb from "@/components/Breadcrumb";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/EventCard"; // <-- Import untuk Related Events dikembalikan!
import { useEventBySlug } from "@/lib/hooks/useEvents";
import { type Event } from "@/lib/types";

// --- Helper Functions ---
const formatEventDateTime = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const dateOpts: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };

  const startDateStr = startDate.toLocaleDateString("id-ID", dateOpts);
  const endDateStr = endDate.toLocaleDateString("id-ID", dateOpts);
  const startTimeStr = startDate.toLocaleTimeString("id-ID", timeOpts);
  const endTimeStr = endDate.toLocaleTimeString("id-ID", timeOpts);

  if (startDateStr === endDateStr) {
    return `${startDateStr}, ${startTimeStr} - ${endTimeStr} WIB`;
  }
  return `${startDateStr} (${startTimeStr} WIB) - ${endDateStr} (${endTimeStr} WIB)`;
};

const getGoogleCalendarUrl = (event: Event) => {
  const formatTime = (dateStr: string) =>
    new Date(dateStr).toISOString().replace(/-|:|\.\d\d\d/g, "");
  const start = formatTime(event.start_date);
  const end = formatTime(event.end_date);
  const title = encodeURIComponent(event.title);
  const details = encodeURIComponent(event.description || "");
  const loc = encodeURIComponent(event.location || "");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${loc}`;
};

// --- Sub-components ---
function QuickInfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-2xl border bg-surface/40 hover:bg-surface/80 transition-all duration-300 shadow-sm hover:shadow-md">
      <div className="p-3.5 bg-primary/10 text-primary rounded-xl shrink-0">
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-muted-foreground mb-1">
          {title}
        </span>
        <span className="font-semibold text-foreground break-words leading-snug">
          {value}
        </span>
      </div>
    </div>
  );
}

function EventDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-pulse">
      <div className="h-6 w-64 bg-muted rounded mb-8"></div>
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="w-full lg:w-[400px] shrink-0 h-[500px] bg-muted rounded-2xl"></div>
        <div className="flex-1 space-y-6">
          <div className="h-10 w-3/4 bg-muted rounded"></div>
          <div className="h-20 w-full bg-muted rounded"></div>
          <div className="h-40 w-full bg-muted rounded"></div>
        </div>
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function EventDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  // FIX: Tarik data relatedEvents dari hook
  const { event, isLoading, error, user, isSaved, relatedEvents } =
    useEventBySlug(slug);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // TYPE SAFETY FIXES
  const safeUser = user ?? null;
  const safeIsSaved = isSaved ?? false;
  const safeRelatedEvents = relatedEvents ?? [];

  const eventUrl = isMounted
    ? window.location.href
    : `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/event/${slug}`;

  // Handle tombol escape untuk modal gambar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsImageModalOpen(false);
    };
    if (isImageModalOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isImageModalOpen]);

  if (isLoading) return <EventDetailSkeleton />;

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-6xl flex flex-col items-center justify-center">
        <EmptyState
          title="Event Tidak Ditemukan"
          message="Maaf, event yang Anda cari mungkin telah dihapus atau URL tidak valid."
        />
      </div>
    );
  }

  const isPastEvent = new Date(event.end_date) < new Date();

  return (
    <>
      <main className="container mx-auto px-4 sm:px-6 py-8 md:py-10 max-w-6xl">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Events", href: "/events" },
            { label: event.title, href: "#" },
          ]}
        />

        <div className="mt-8 flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          {/* --- KOLOM KIRI: Poster Event --- */}
          <div className="w-full lg:w-[400px] shrink-0 lg:sticky lg:top-24">
            <div
              className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-border/50 bg-muted group cursor-pointer"
              onClick={() => setIsImageModalOpen(true)}
            >
              <Image
                src={event.image_url || "/hero-bg.webp"}
                alt={`Poster event ${event.title}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <div className="bg-black/60 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 backdrop-blur-sm">
                  <FiMaximize2 size={24} />
                </div>
              </div>

              {/* FIX: Bookmark Button dikembalikan ke atas poster */}
              <div className="z-20 absolute top-0 right-0 w-full h-full pointer-events-none">
                {/* Pointer-events-auto hanya diaktifkan pada area div SaveEvent agar gambar tetap bisa diklik */}
                <div
                  className="pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <SaveEventButton
                    eventId={event.id}
                    isSavedInitial={safeIsSaved}
                    user={safeUser}
                  />
                </div>
              </div>

              {isPastEvent && (
                <div className="absolute top-4 left-4 bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-xl font-bold text-sm backdrop-blur-md shadow-lg">
                  Event Telah Selesai
                </div>
              )}
            </div>
          </div>

          {/* --- KOLOM KANAN: Detail Informasi --- */}
          <div className="flex-1 min-w-0 w-full pb-24 lg:pb-0 space-y-10">
            <header className="space-y-5">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-transparent text-sm px-4 py-1.5 rounded-lg">
                {event.category}
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-foreground leading-tight tracking-tight">
                {event.title}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-surface rounded-full flex items-center justify-center border shadow-sm text-xl text-primary shrink-0">
                    <FaUserFriends />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      Penyelenggara
                    </p>
                    <p className="font-bold text-foreground text-lg">
                      {event.organizer}
                    </p>
                  </div>
                </div>

                {/* --- Action Bar --- */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <ShareDialog eventTitle={event.title} eventUrl={eventUrl} />

                  <a
                    href={getGoogleCalendarUrl(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full h-10 w-10 hover:bg-primary/5 hover:text-primary transition-colors"
                      title="Tambahkan ke Kalender"
                    >
                      <FiCalendar size={18} />
                    </Button>
                  </a>
                </div>
              </div>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <QuickInfoCard
                icon={<FaCalendarAlt size={22} />}
                title="Waktu Pelaksanaan"
                value={formatEventDateTime(event.start_date, event.end_date)}
              />
              <QuickInfoCard
                icon={<FaMapMarkerAlt size={22} />}
                title="Lokasi Event"
                value={event.location}
              />
            </section>

            <section className="hidden lg:flex bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-3xl p-8 items-center justify-between gap-6 shadow-sm">
              <div className="flex-1">
                <h3 className="font-bold text-xl text-foreground mb-1">
                  Tertarik mengikuti event ini?
                </h3>
                <p className="text-muted-foreground">
                  {isPastEvent
                    ? "Maaf, pendaftaran telah ditutup karena event sudah berakhir."
                    : "Segera daftarkan dirimu dan pastikan kamu tidak kehabisan kuota!"}
                </p>
              </div>
              <div className="shrink-0 w-56">
                <RegisterButton
                  link={event.registration_link}
                  user={safeUser}
                />
              </div>
            </section>

            <section className="pt-2">
              <h2 className="text-2xl font-heading font-bold mb-5 flex items-center gap-2">
                Deskripsi Event
              </h2>
              <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {event.description ||
                  "Penyelenggara tidak menyediakan deskripsi detail untuk event ini."}
              </div>
            </section>

            <section className="space-y-8 pt-8 border-t">
              {event.target_majors && event.target_majors.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
                    <FaGraduationCap size={16} /> Target Audiens
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {event.target_majors.map((major) => (
                      <Badge
                        key={major}
                        variant="outline"
                        className="text-sm py-1.5 px-3 rounded-lg bg-surface/50"
                      >
                        {major}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {event.tags && event.tags.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
                    <FaTags size={14} /> Topik Terkait
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {event.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-sm font-normal py-1.5 px-3 rounded-lg"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* FIX: Related Events Dikembalikan ke Sini! */}
            {safeRelatedEvents.length > 0 && (
              <section className="pt-10 mt-10 border-t">
                <h2 className="text-2xl font-heading font-bold mb-6">
                  Kamu Mungkin Suka
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {safeRelatedEvents.map((relatedEvent) => (
                    <EventCard
                      key={relatedEvent.id}
                      event={relatedEvent}
                      isSaved={false} // Default false untuk event terkait di preview
                      user={safeUser}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      {/* --- MOBILE CTA BUTTON --- */}
      <div className="lg:hidden">
        <StickyRegisterButton link={event.registration_link} user={safeUser} />
      </div>

      {/* --- FULLSCREEN IMAGE MODAL --- */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsImageModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-8"
          >
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors duration-200"
            >
              <FiX size={28} />
            </button>
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full h-full max-w-4xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={event.image_url || "/hero-bg.webp"}
                alt={`Poster event ${event.title}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
