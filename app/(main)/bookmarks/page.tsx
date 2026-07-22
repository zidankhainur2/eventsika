import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSavedEvents } from '@/modules/bookmark/actions';
import EventCard from '@/components/shared/EventCard';
import EmptyState from '@/components/shared/EmptyState';
import { type Event } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Bookmark Tersimpan — EventSika',
  description: 'Lihat semua event yang telah Anda simpan.',
};

export default async function BookmarksPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect unauthenticated users to login
  if (!user) {
    redirect('/login');
  }

  const savedEvents = await getSavedEvents();

  return (
    <div className="bg-background min-h-screen pb-16">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-10">

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Bookmark Tersimpan
          </h1>
          <p className="text-muted-foreground mt-2">
            Event yang Anda simpan untuk dibaca nanti.
          </p>
        </div>

        {savedEvents.length === 0 ? (
          <EmptyState
            title="Belum Ada Bookmark"
            description="Anda belum menyimpan event apapun. Jelajahi event dan klik ikon bookmark untuk menyimpannya."
            actionLabel="Jelajahi Event"
            actionHref="/explore"
          />
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {savedEvents.length} event tersimpan
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {savedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event as unknown as Event}
                  user={user}
                />
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
