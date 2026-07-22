'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toggleBookmark } from '@/modules/bookmark/actions';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  eventId: string;
  isBookmarked: boolean;
  userId?: string;
  className?: string;
}

/**
 * BookmarkButton — Client Component
 *
 * Allows users to save/unsave events.
 * Redirects guests to login page.
 * Uses useTransition for non-blocking UI updates.
 */
export default function BookmarkButton({
  eventId,
  isBookmarked: initialIsBookmarked,
  userId,
  className,
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    if (!userId) {
      toast.error('Masuk terlebih dahulu untuk menyimpan event.', {
        action: {
          label: 'Masuk',
          onClick: () => (window.location.href = '/login'),
        },
      });
      return;
    }

    // Optimistic update
    setIsBookmarked((prev) => !prev);

    startTransition(async () => {
      const result = await toggleBookmark(eventId);

      if (result.success && result.data !== undefined) {
        setIsBookmarked(result.data.saved);
        toast.success(result.message);
      } else if (!result.success) {
        // Revert optimistic update on failure
        setIsBookmarked((prev) => !prev);
        toast.error(result.message);
      }
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        'h-11 w-11 rounded-lg border-gray-300 transition-all duration-200',
        isBookmarked
          ? 'bg-[#E3F2FD] border-[#1976D2] text-[#1976D2] hover:bg-[#BBDEFB]'
          : 'text-gray-500 hover:text-[#1976D2] hover:border-[#1976D2]',
        className
      )}
      onClick={handleToggle}
      disabled={isPending}
      aria-label={isBookmarked ? 'Hapus dari bookmark' : 'Simpan ke bookmark'}
      aria-pressed={isBookmarked}
    >
      {isBookmarked ? (
        <BookmarkCheck className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Bookmark className="h-5 w-5" aria-hidden="true" />
      )}
    </Button>
  );
}
