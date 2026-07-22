"use client";

import { FiHeart } from "react-icons/fi";
import { toggleSaveEvent } from "@/app/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { type User } from "@supabase/supabase-js";
import * as queries from "@/lib/queries";

interface SaveEventButtonProps {
  eventId: string;
  isSavedInitial?: boolean;
  user: User | null;
  className?: string;
}

export default function SaveEventButton({
  eventId,
  isSavedInitial = false,
  user,
  className = "",
}: SaveEventButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch the current user's saved events set from cache/query
  const { data: savedEventIds } = useQuery({
    queryKey: ["savedEvents"],
    queryFn: queries.getSavedEventIds,
    enabled: !!user,
  });

  // Determine if this event is currently saved
  const isSaved = savedEventIds ? savedEventIds.has(eventId) : isSavedInitial;

  const { mutate, isPending } = useMutation({
    mutationFn: async (currentIsSaved: boolean) => {
      const { error } = await toggleSaveEvent(eventId, currentIsSaved);
      if (error) {
        throw new Error(error);
      }
    },
    onMutate: async (currentIsSaved: boolean) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["savedEvents"] });

      // Snapshot the previous value
      const previousSavedEvents = queryClient.getQueryData<Set<string>>(["savedEvents"]);

      // Optimistically update the cache
      queryClient.setQueryData<Set<string>>(["savedEvents"], (old) => {
        const newSet = new Set(old || []);
        if (currentIsSaved) {
          newSet.delete(eventId);
        } else {
          newSet.add(eventId);
        }
        return newSet;
      });

      // Return context with snapshotted value
      return { previousSavedEvents };
    },
    onError: (err, currentIsSaved, context) => {
      // Rollback to the previous state
      if (context?.previousSavedEvents) {
        queryClient.setQueryData(["savedEvents"], context.previousSavedEvents);
      }
      toast.error("Gagal menyimpan event", { description: err.message });
    },
    onSuccess: (data, currentIsSaved) => {
      toast.success(
        currentIsSaved
          ? "Event dihapus dari simpanan"
          : "Event berhasil disimpan!"
      );
    },
    onSettled: () => {
      // Always refetch after error or success to keep server state in sync
      queryClient.invalidateQueries({ queryKey: ["savedEvents"] });
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if this button is inside a Link
    if (!user) {
      toast.error("Akses Ditolak", {
        description: "Anda harus login terlebih dahulu untuk menyimpan event.",
        action: {
          label: "Login",
          onClick: () => router.push("/login"),
        },
      });
      return;
    }
    mutate(isSaved);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`p-2 rounded-full transition-colors duration-200 ${
        isSaved
          ? "bg-red-100 text-red-500 hover:bg-red-200"
          : "bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-red-100 hover:text-red-500"
      } ${className}`}
      aria-label={isSaved ? "Batal simpan event" : "Simpan event"}
    >
      <FiHeart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
    </button>
  );
}
