import Image from 'next/image';
import Link from 'next/link';
import { MapPin, CalendarDays, User as UserIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type Event } from '@/lib/types';
import SaveEventButton from '@/components/SaveEventButton';
import { type User } from '@supabase/supabase-js';

// Format helper
const formatEventDateStr = (start: string) => {
  const date = new Date(start);
  return `${date.getDate()} ${date.toLocaleDateString("id-ID", { month: "short", year: "numeric" })} • ${date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`;
};

interface EventCardProps {
  event: Event;
  aiExplanation?: string;
  isSaved?: boolean;
  user?: User | null;
  variant?: 'default' | 'compact' | 'featured';
  priority?: boolean;
}

export default function EventCard({ event, aiExplanation, isSaved = false, user = null, variant = 'default', priority = false }: EventCardProps) {
  const categoryTag = event.category || 'EVENT KAMPUS';
  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';

  // Shadow class based on feature variant
  const shadowClass = isFeatured 
    ? "shadow-[4px_4px_0px_#CDF22B] hover:shadow-[6px_6px_0px_#CDF22B]" 
    : "shadow-[4px_4px_0px_#0A0A0A] hover:shadow-[6px_6px_0px_#0A0A0A]";

  return (
    <div className="h-full">
      <Card className={`h-full flex flex-col border-2 border-[#0A0A0A] rounded-xl bg-white transition-all duration-100 hover:-translate-x-[1px] hover:-translate-y-[1px] ${shadowClass} overflow-hidden`}>
        
        {/* Thumbnail Area - Hidden on compact */}
        {!isCompact && (
          <div className="relative aspect-video w-full overflow-hidden border-b-2 border-[#0A0A0A] bg-muted">
            <Image 
              src={event.image_url || '/placeholder-event.webp'} 
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
            />
            
            {/* Category Badge */}
            <div className="absolute top-3 left-3 flex gap-2 z-10">
              <Badge variant="lime" className="shadow-sm">
                {categoryTag}
              </Badge>
              {isFeatured && (
                <Badge variant="black" className="shadow-sm">
                  Featured
                </Badge>
              )}
            </div>

            {/* Bookmark Button */}
            {user !== undefined && (
              <div className="absolute top-3 right-3 z-10">
                <SaveEventButton 
                  eventId={event.id}
                  isSavedInitial={isSaved}
                  user={user}
                  className="shadow-[2px_2px_0px_#0A0A0A] border-2 border-[#0A0A0A] bg-white hover:bg-[#F7F7F5] rounded-lg transition-all"
                />
              </div>
            )}
          </div>
        )}
        
        {/* Content Area */}
        <CardContent className="p-4 flex flex-col flex-1 gap-3">
          {isCompact && (
             <div className="flex gap-2 mb-1">
               <Badge variant="lime">{categoryTag}</Badge>
               {isFeatured && (
                 <Badge variant="black">Featured</Badge>
               )}
             </div>
          )}

          <p className="text-xs text-[#6B6B6B] font-semibold flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5 text-[#0A0A0A]" />
            <span>{formatEventDateStr(event.start_date || new Date().toISOString())}</span>
          </p>

          <h3 className="text-base font-extrabold uppercase tracking-tight text-[#0A0A0A] leading-tight line-clamp-2">
            {event.title}
          </h3>
          
          <div className="flex flex-col gap-2 mt-auto pt-2">
             {event.location && (
               <div className="text-sm text-[#6B6B6B] flex items-center gap-1.5">
                 <MapPin className="w-4 h-4 text-[#0A0A0A] shrink-0" />
                 <span className="truncate">{event.location}</span>
               </div>
             )}

             <div className="text-sm text-[#6B6B6B] flex items-center gap-1.5 border-t border-[#E8E8E8] pt-2 mt-1">
               <UserIcon className="w-4 h-4 text-[#0A0A0A] shrink-0" />
               <span className="truncate font-medium">{event.organizer || 'Organizer'}</span>
             </div>
          </div>

          {/* AI Recommendation Highlight - Invisible AI concept (no AI wording) */}
          {aiExplanation && (
            <div className="mt-2 pt-2 border-t border-[#E8E8E8]">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A0A0A] bg-[#CDF22B] border border-[#0A0A0A] px-2.5 py-1 rounded-md">
                ✨ {aiExplanation}
              </span>
            </div>
          )}

          <Link href={`/event/${event.slug}`} className="w-full mt-2 block">
            <Button className="w-full" variant="primary" size="default">
              LIHAT DETAIL
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
