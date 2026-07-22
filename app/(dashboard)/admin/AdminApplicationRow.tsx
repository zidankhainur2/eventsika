'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  approveOrganizerApplication,
  rejectOrganizerApplication,
} from '@/modules/admin/actions';
import type { OrganizerApplication } from '@/types';

interface AdminApplicationRowProps {
  application: OrganizerApplication;
}

export default function AdminApplicationRow({ application }: AdminApplicationRowProps) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveOrganizerApplication(
        application.id,
        application.user_id
      );
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      const result = await rejectOrganizerApplication(application.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
      {/* Icon */}
      <div className="shrink-0 h-12 w-12 bg-[#E3F2FD] rounded-xl flex items-center justify-center hidden sm:flex">
        <Building className="h-6 w-6 text-[#1976D2]" aria-hidden="true" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900">{application.organization_name}</p>
        <p className="text-sm text-gray-500 mt-0.5">
          Kontak: {application.contact_person}
        </p>
        {application.email && (
          <p className="text-xs text-gray-400 mt-0.5">Email: {application.email}</p>
        )}
        <p className="text-xs text-gray-400 mt-0.5">
          Diajukan:{' '}
          {new Date(application.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white text-xs"
          onClick={handleApprove}
          disabled={isPending}
          aria-label={`Setujui aplikasi ${application.organization_name}`}
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
          aria-label={`Tolak aplikasi ${application.organization_name}`}
        >
          <XCircle className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
          Tolak
        </Button>
      </div>
    </div>
  );
}
