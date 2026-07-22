import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getPublishedEvents } from '@/modules/events/queries';
import type { EventFilters } from '@/types';
import EventCard from '@/components/shared/EventCard';
import EmptyState from '@/components/shared/EmptyState';
import EventGridSkeleton from '@/components/shared/EventGridSkeleton';
import ExploreFilters from '@/components/explore/ExploreFilters';
import { createClient } from '@/lib/supabase/server';
import { type Event } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Eksplorasi Event — EventSika',
  description:
    'Jelajahi semua seminar, workshop, kompetisi, dan kegiatan kemahasiswaan.',
};

export const revalidate = 300;

interface ExplorePageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
  }>;
}

// ─── Event Results ─────────────────────────────────────────────

async function EventResults({ filters }: { filters: EventFilters }) {
  const events = await getPublishedEvents(filters);
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (events.length === 0) {
    return (
      <EmptyState
        title="Tidak Ada Event Ditemukan"
        description={
          filters.search
            ? `Tidak ada event yang cocok dengan pencarian "${filters.search}". Coba kata kunci lain atau hapus filter.`
            : 'Belum ada event yang tersedia. Kembali lagi nanti!'
        }
        actionLabel="Reset Filter"
        actionHref="/explore"
      />
    );
  }

  return (
    <>
      <p className="text-sm text-muted-foreground mb-4">
        Menampilkan <strong>{events.length}</strong> event
        {filters.search ? ` untuk "${filters.search}"` : ''}
        {filters.category ? ` dalam kategori ${filters.category}` : ''}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {(events as Event[]).map((event) => (
          <EventCard key={event.id} event={event} user={user} />
        ))}
      </div>
    </>
  );
}

// ─── Page ──────────────────────────────────────────────────────

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;

  const filters: EventFilters = {
    search: params.q,
    category: params.category,
    sort: (params.sort as EventFilters['sort']) ?? 'upcoming',
    limit: 24,
  };

  return (
    <div className="bg-background min-h-screen pb-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 space-y-8">

        {/* Page Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Eksplorasi Event
          </h1>
          <p className="text-muted-foreground mt-2">
            Temukan seminar, workshop, kompetisi, dan kegiatan kemahasiswaan terbaik.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Client-side Filters + Search bar (Sidebar on Desktop, Top on Mobile) */}
          <div className="w-full md:w-72 shrink-0">
            <ExploreFilters
              initialQuery={params.q ?? ''}
              initialCategory={params.category ?? ''}
              initialSort={params.sort ?? 'upcoming'}
            />
          </div>

          {/* Results — wrapped in Suspense for streaming */}
          <div className="flex-1">
            <Suspense fallback={<EventGridSkeleton count={8} />}>
              <EventResults filters={filters} />
            </Suspense>
          </div>
        </div>

      </div>
    </div>
  );
}
