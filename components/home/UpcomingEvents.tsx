import { createClient } from '@/lib/supabase/server';
import EventCard from '@/components/shared/EventCard';
import EmptyState from '@/components/shared/EmptyState';
import { Event } from '@/lib/types';

export default async function UpcomingEvents() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true })
    .limit(8);

  if (error || !events || events.length === 0) {
    return (
      <EmptyState 
        title="Belum Ada Event Akan Datang"
        description="Saat ini belum ada event baru yang diterbitkan oleh organizer."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {(events as Event[]).map((event, index) => (
        <EventCard key={`upcoming-${event.id}`} event={event} user={user} priority={index < 4} />
      ))}
    </div>
  );
}