'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { approveEvent, rejectEvent } from '@/modules/admin/actions';
import type { Event } from '@/types';

interface AdminEventRowProps {
  event: Event;
}

export default function AdminEventRow({ event }: AdminEventRowProps) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveEvent(event.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleReject = () => {
    const reason = window.prompt(
      'Masukkan alasan penolakan (opsional):',
      'Tidak memenuhi pedoman platform.'
    );
    if (reason === null) return; // user cancelled

    startTransition(async () => {
      const result = await rejectEvent(event.id, reason || undefined);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const posterSrc = event.image_url || event.poster_url;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
      {/* Thumbnail */}
      {posterSrc && (
        <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 hidden sm:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={posterSrc}
            alt={`Poster ${event.title}`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 line-clamp-1">{event.title}</p>
        <p className="text-sm text-gray-500 mt-0.5">
          {event.organizer_name} · {event.category}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          Diajukan:{' '}
          {new Date(event.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Button variant="outline" size="sm" asChild className="text-xs">
          <Link href={`/event/${event.slug}`} target="_blank">
            <ExternalLink className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
            Preview
          </Link>
        </Button>
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white text-xs"
          onClick={handleApprove}
          disabled={isPending}
          aria-label={`Setujui event ${event.title}`}
        >
          <CheckCircle className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
          Setujui
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-red-300 text-red-600 hover:bg-red-50 text-xs"
          onClick={handleReject}
          disabled={isPending}
          aria-label={`Tolak event ${event.title}`}
        >
          <XCircle className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
          Tolak
        </Button>
      </div>
    </div>
  );
}
