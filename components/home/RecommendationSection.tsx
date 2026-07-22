import { createClient } from '@/lib/supabase/server';
import { getPersonalizedRecommendations } from '@/modules/recommendation/ai-service';
import EventCard from '@/components/shared/EventCard';
import { type Event } from '@/lib/types';
import { SplashBlobBlue, SplashDotBlue } from '@/components/ui/splashes';
import CarouselContainer from '@/components/shared/CarouselContainer';

export default async function RecommendationSection() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Guest State: Render nothing if not logged in ──────────
  if (!user) {
    return null;
  }

  // ── Fetch user interests ───────────────────────────────────
  const { data: profile } = await supabase
    .from('profiles')
    .select('interests')
    .eq('id', user.id)
    .single();

  const rawInterests = profile?.interests;
  const userInterests: string[] = rawInterests
    ? (typeof rawInterests === 'string'
        ? rawInterests.split(',').map((i) => i.trim()).filter(Boolean)
        : rawInterests)
    : [];

  // ── Get Recommendations ─────────
  const result = await getPersonalizedRecommendations(user.id, userInterests);

  if (!result.events || result.events.length === 0) {
    return null; // Return null if no recommendation available (graceful degradation)
  }

  return (
    <section className="relative overflow-hidden bg-white py-16 border-b-2 border-[#0A0A0A] -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8">
      {/* Decorative Splashes */}
      <SplashBlobBlue className="absolute -top-10 -right-10 w-80 h-80 pointer-events-none z-0" />
      <SplashDotBlue className="absolute bottom-10 left-10 w-6 h-6 pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Label Section */}
        <h2 className="text-sm font-bold uppercase tracking-widest text-[#6B6B6B]">
          DIPILIHKAN UNTUKMU
        </h2>

        {/* Horizontal Scroll Layout */}
        <CarouselContainer>
          {result.events.map((event, index) => (
            <div key={`rec-${event.id}`} className="min-w-[280px] sm:min-w-[300px] max-w-[320px] shrink-0 snap-start">
              <EventCard
                event={event as unknown as Event}
                user={user}
                aiExplanation={
                  result.strategy === 'ai_vector' ? result.explanation : undefined
                }
                priority={index < 2}
              />
            </div>
          ))}
        </CarouselContainer>
      </div>
    </section>
  );
}