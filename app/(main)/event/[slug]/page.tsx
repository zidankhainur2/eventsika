import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, Users, Tag, ExternalLink, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { type Event } from '@/lib/types';

import { getEventBySlug, getRelatedEvents } from '@/modules/events/queries';
import { isEventBookmarked } from '@/modules/bookmark/actions';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import EventCard from '@/components/shared/EventCard';
import BookmarkButton from '@/components/shared/BookmarkButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


// ─── Metadata ─────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: 'Event Tidak Ditemukan — EventSika' };
  }

  return {
    title: `${event.title} — EventSika`,
    description: event.description?.slice(0, 155) ?? 'Detail event kampus EventSika.',
    openGraph: {
      title: event.title,
      description: event.description?.slice(0, 155),
      images: event.image_url ? [{ url: event.image_url }] : [],
    },
  };
}

// ─── Helper Functions ──────────────────────────────────────────

function formatEventDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatEventTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateTimeRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const sameDay = start.toDateString() === end.toDateString();

  if (sameDay) {
    return `${formatEventDate(startDate)}, ${formatEventTime(startDate)} – ${formatEventTime(endDate)} WIB`;
  }
  return `${formatEventDate(startDate)} – ${formatEventDate(endDate)}`;
}

// ─── Page Component ────────────────────────────────────────────

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch event data (server-side)
  const event = await getEventBySlug(slug);

  // Redirect to 404 if event not found or not published
  if (!event) {
    notFound();
  }

  const isPastEvent = new Date(event.end_date ?? event.start_date) < new Date();

  // Parallel data fetching for related events and auth state
  const [relatedEvents, supabaseClient] = await Promise.all([
    getRelatedEvents(event.category, event.id, 3),
    Promise.resolve(createClient()),
  ]);

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  const isBookmarked = user ? await isEventBookmarked(event.id) : false;

  const posterSrc = event.image_url || event.poster_url || '/placeholder-event.webp';
  const organizerName = event.organizer_name || event.organizer || 'Organizer';
  const startDate = event.start_date || event.date || '';
  const endDate = event.end_date || event.date || '';

  return (
    <main className="bg-white min-h-screen pb-20">
      
      {/* ── TOP: Thumbnail ──────────────────────────── */}
      <div className="relative w-full h-[300px] md:h-[400px] bg-muted border-b-2 border-[#0A0A0A]">
        <Image
          src={posterSrc}
          alt={`Poster event ${event.title}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        
        <div className="absolute top-0 left-0 w-full pt-6">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <nav aria-label="Breadcrumb">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors font-semibold uppercase tracking-wide drop-shadow-md"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Kembali ke Eksplorasi
              </Link>
            </nav>
          </div>
        </div>

        {isPastEvent && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-[#DC2626] text-white text-base md:text-lg font-bold border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] px-6 py-3 rounded-lg uppercase tracking-wider">
              Event Telah Selesai
            </span>
          </div>
        )}
      </div>

      <div className="container mx-auto max-w-6xl px-4 md:px-6 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

          {/* ── LEFT COLUMN (2/3): Content ─────────────────────────── */}
          <div className="w-full lg:w-2/3 space-y-8">
            <header className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="lime" className="px-3 py-1 text-xs">
                  {event.category}
                </Badge>
                {isPastEvent && (
                  <Badge variant="destructive" className="px-3 py-1 text-xs">
                    Event Selesai
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-[#0A0A0A] leading-none">
                {event.title}
              </h1>
              <div className="flex items-center gap-3 pt-2">
                <div className="h-10 w-10 bg-white border-2 border-[#0A0A0A] rounded-full flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5 text-[#0A0A0A]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-[#6B6B6B] font-extrabold uppercase tracking-wider">
                    Penyelenggara
                  </p>
                  <p className="font-bold text-[#0A0A0A]">{organizerName}</p>
                </div>
              </div>
            </header>

            <Tabs defaultValue="detail" className="w-full">
              <TabsList className="w-full justify-start border-b-2 border-[#0A0A0A] rounded-none h-auto p-0 bg-transparent gap-2">
                <TabsTrigger 
                  value="detail" 
                  className="rounded-none border-b-4 border-transparent data-[state=active]:border-[#1E45FB] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 font-extrabold uppercase text-sm text-[#0A0A0A]"
                >
                  Detail Event
                </TabsTrigger>
                {(event.tags?.length > 0 || (event.target_majors && event.target_majors.length > 0)) && (
                  <TabsTrigger 
                    value="info"
                    className="rounded-none border-b-4 border-transparent data-[state=active]:border-[#1E45FB] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 font-extrabold uppercase text-sm text-[#0A0A0A]"
                  >
                    Info Tambahan
                  </TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="detail" className="pt-6">
                <div className="prose prose-sm md:prose-base prose-gray max-w-none text-[#0A0A0A] leading-relaxed whitespace-pre-wrap font-medium">
                  {event.description || 'Penyelenggara belum menyediakan deskripsi untuk event ini.'}
                </div>
              </TabsContent>

              {(event.tags?.length > 0 || (event.target_majors && event.target_majors.length > 0)) && (
                <TabsContent value="info" className="pt-6 space-y-6">
                  {event.target_majors && event.target_majors.length > 0 && (
                    <div>
                      <p className="text-xs text-[#6B6B6B] font-extrabold uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Users className="h-4 w-4 text-[#0A0A0A]" aria-hidden="true" />
                        Target Audiens
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {event.target_majors.map((major) => (
                          <Badge key={major} variant="white" className="rounded-full">
                            {major}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {event.tags?.length > 0 && (
                    <div>
                      <p className="text-xs text-[#6B6B6B] font-extrabold uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Tag className="h-4 w-4 text-[#0A0A0A]" aria-hidden="true" />
                        Topik Terkait
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag) => (
                          <Badge key={tag} variant="lime" className="rounded-full">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              )}
            </Tabs>
          </div>

          {/* ── RIGHT COLUMN (1/3): Sticky Card ──────────────────────────── */}
          <aside className="w-full lg:w-1/3 shrink-0 lg:sticky lg:top-24 hidden lg:block">
            <Card className="border-2 border-[#0A0A0A] rounded-xl shadow-[4px_4px_0px_#0A0A0A] bg-white overflow-hidden">
              <CardContent className="p-6 space-y-6">
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[#CDF22B] border border-[#0A0A0A] rounded-lg shrink-0 mt-0.5">
                      <Calendar className="h-5 w-5 text-[#0A0A0A]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6B6B6B] font-extrabold uppercase tracking-wider mb-0.5">
                        Pelaksanaan
                      </p>
                      <p className="font-bold text-[#0A0A0A] text-sm leading-snug">
                        {startDate && endDate
                          ? formatDateTimeRange(startDate, endDate)
                          : 'Belum ditentukan'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[#CDF22B] border border-[#0A0A0A] rounded-lg shrink-0 mt-0.5">
                      <MapPin className="h-5 w-5 text-[#0A0A0A]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6B6B6B] font-extrabold uppercase tracking-wider mb-0.5">
                        Lokasi
                      </p>
                      <p className="font-bold text-[#0A0A0A] text-sm">{event.location}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-[#0A0A0A] flex flex-col gap-3">
                  {!isPastEvent && event.registration_link && (
                    <Button
                      asChild
                      variant="primary"
                      className="w-full text-base h-12"
                    >
                      <a
                        href={event.registration_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Daftar event ${event.title}`}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" />
                        Daftar Sekarang
                      </a>
                    </Button>
                  )}

                  <div className="w-full flex items-center justify-center border-2 border-[#0A0A0A] rounded-lg h-12 bg-white hover:bg-[#F7F7F5] transition-all shadow-[2px_2px_0px_#0A0A0A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#0A0A0A] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                     <BookmarkButton
                        eventId={event.id}
                        isBookmarked={isBookmarked}
                        userId={user?.id}
                      />
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

        </div>

        {/* ── Related Events ─────────────────────────── */}
        {relatedEvents.length > 0 && (
          <section aria-labelledby="related-heading" className="pt-16 mt-8 border-t-2 border-[#0A0A0A]">
            <h2 id="related-heading" className="text-2xl font-extrabold uppercase tracking-tight text-[#0A0A0A] mb-6">
              Event Terkait
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
              {relatedEvents.map((related) => (
                <EventCard key={related.id} event={related as unknown as Event} user={user} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Mobile Sticky Bottom Bar ─────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t-2 border-[#0A0A0A] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 flex items-center gap-3">
        {!isPastEvent && event.registration_link && (
          <Button
            asChild
            variant="primary"
            className="flex-1 text-base h-12"
          >
            <a
              href={event.registration_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" />
              Daftar Sekarang
            </a>
          </Button>
        )}
        <div className="shrink-0 flex items-center justify-center border-2 border-[#0A0A0A] rounded-lg h-12 w-12 bg-white shadow-[2px_2px_0px_#0A0A0A]">
           <BookmarkButton
              eventId={event.id}
              isBookmarked={isBookmarked}
              userId={user?.id}
            />
        </div>
      </div>
    </main>
  );
}
