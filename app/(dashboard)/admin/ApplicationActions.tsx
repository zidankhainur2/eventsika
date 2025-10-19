"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  approveOrganizerApplication,
  rejectOrganizerApplication,
} from "@/app/action";
import { Button } from "@/components/ui/button";

export function ApplicationActions({
  applicationId,
  userId,
}: {
  applicationId: string;
  userId: string;
}) {
  const queryClient = useQueryClient();

  const useCreateMutation = (
    actionFn: () => Promise<any>,
    successMsg: string,
    errorMsg: string
  ) => {
    return useMutation({
      mutationFn: async () => {
        const result = await actionFn();
        if (result.type === "error") throw new Error(result.message);
        return result;
      },
      onSuccess: (data) => {
        toast.success(successMsg, { description: data.message });
        queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
      },
      onError: (error) => {
        toast.error(errorMsg, { description: error.message });
      },
    });
  };

  // Perbaikan 2: Panggil custom hook dengan benar
  const { mutate: approve, isPending: isApproving } = useCreateMutation(
    () =>
      approveOrganizerApplication(null, new FormData(), applicationId, userId),
    "Pengajuan Disetujui",
    "Gagal Menyetujui"
  );

  const { mutate: reject, isPending: isRejecting } = useCreateMutation(
    () => rejectOrganizerApplication(null, new FormData(), applicationId),
    "Pengajuan Ditolak",
    "Gagal Menolak"
  );

  return (
    <div className="flex gap-2 w-full sm:w-auto">
      <Button
        size="sm"
        onClick={() => approve()}
        disabled={isApproving || isRejecting}
        className="flex-1 bg-green-600 hover:bg-green-700"
      >
        {isApproving ? "..." : "Setujui"}
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => reject()}
        disabled={isApproving || isRejecting}
        className="flex-1"
      >
        {isRejecting ? "..." : "Tolak"}
      </Button>
    </div>
  );
}
