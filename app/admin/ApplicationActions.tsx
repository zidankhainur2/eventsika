"use client";

import { useFormStatus } from "react-dom";
import {
  approveOrganizerApplication,
  rejectOrganizerApplication,
} from "@/app/action";
import { Button } from "@/components/ui/Button";

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
  
  const handleApprove = async () => {
    await approveOrganizerApplication(applicationId, userId);
  };

  const handleReject = async () => {
    await rejectOrganizerApplication(applicationId);
  };

  return (
    <div className="flex gap-2 w-full sm:w-auto">
      <form action={handleApprove} className="flex-1">
        <ActionButton variant="approve">Setujui</ActionButton>
      </form>
      <form action={handleReject} className="flex-1">
        <ActionButton variant="reject">Tolak</ActionButton>
      </form>
    </div>
  );
}
