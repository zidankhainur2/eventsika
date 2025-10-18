// app/admin/ApplicationActions.tsx
"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  approveOrganizerApplication,
  rejectOrganizerApplication,
} from "@/app/action";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

function ActionButton({
  variant,
  children,
}: {
  variant: "approve" | "reject";
  children: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className={`w-full sm:w-auto px-4 py-2 text-sm ${
        variant === "approve"
          ? "bg-green-600 hover:bg-green-700"
          : "bg-red-600 hover:bg-red-700"
      }`}
    >
      {pending ? "..." : children}
    </Button>
  );
}

export function ApplicationActions({
  applicationId,
  userId,
}: {
  applicationId: string;
  userId: string;
}) {
  // PERBAIKAN: Gunakan useActionState untuk menangani feedback
  const [approveState, approveAction] = useActionState(
    approveOrganizerApplication.bind(null, applicationId, userId),
    null
  );
  const [rejectState, rejectAction] = useActionState(
    rejectOrganizerApplication.bind(null, applicationId),
    null
  );

  useEffect(() => {
    if (approveState?.type === "error") {
      toast.error("Gagal Menyetujui", { description: approveState.message });
    }
    // Tambahkan notifikasi sukses
    if (approveState?.type === "success") {
      toast.success("Pengajuan Disetujui", {
        description: approveState.message,
      });
    }
  }, [approveState]);

  useEffect(() => {
    if (rejectState?.type === "error") {
      toast.error("Gagal Menolak", { description: rejectState.message });
    }
    // Tambahkan notifikasi sukses
    if (rejectState?.type === "success") {
      toast.success("Pengajuan Ditolak", { description: rejectState.message });
    }
  }, [rejectState]);

  return (
    <div className="flex gap-2 w-full sm:w-auto">
      <form action={approveAction} className="flex-1">
        <ActionButton variant="approve">Setujui</ActionButton>
      </form>
      <form action={rejectAction} className="flex-1">
        <ActionButton variant="reject">Tolak</ActionButton>
      </form>
    </div>
  );
}
