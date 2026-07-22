import { cn } from '@/lib/utils';
import type { EventStatus } from '@/types';

const STATUS_CONFIG: Record<EventStatus, { label: string; className: string }> = {
  published: {
    label: 'Dipublikasikan',
    className: 'bg-green-100 text-green-700 border-green-200',
  },
  pending: {
    label: 'Menunggu Review',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  rejected: {
    label: 'Ditolak',
    className: 'bg-red-100 text-red-700 border-red-200',
  },
  draft: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-600 border-gray-200',
  },
};

interface EventStatusBadgeProps {
  status: EventStatus;
  className?: string;
}

export default function EventStatusBadge({ status, className }: EventStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border',
        config.className,
        className
      )}
      aria-label={`Status: ${config.label}`}
    >
      {config.label}
    </span>
  );
}
