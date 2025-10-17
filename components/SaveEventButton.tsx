"use client";

import { FiHeart } from "react-icons/fi";
import { toggleSaveEvent } from "@/app/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type User } from "@supabase/supabase-js";

interface SaveEventButtonProps {
  eventId: string;
  isSavedInitial: boolean;
  user: User | null;
}

export default function SaveEventButton({
  eventId,
  isSavedInitial,
  user,
}: SaveEventButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (currentIsSaved: boolean) => {
      const { error } = await toggleSaveEvent(eventId, currentIsSaved);
      if (error) {
        throw new Error(error);
      }
    },
    onMutate: async (currentIsSaved: boolean) => {
      await queryClient.cancelQueries({ queryKey: ["savedEvents"] });

      const previousIsSaved = isSavedInitial;

      return { previousIsSaved }; 
    },
    onError: (err, newIsSaved, context) => {
     
      toast.error("Gagal menyimpan event", { description: err.message });
      
    },
    onSuccess: () => {
      toast.success(
        isSavedInitial
          ? "Event dihapus dari simpanan"
          : "Event berhasil disimpan!"
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["savedEvents"] });
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    },
  });

  const handleClick = () => {
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
    mutate(isSavedInitial);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`absolute top-3 right-3 p-2 rounded-full transition-colors duration-200 ${
        isSavedInitial
          ? "bg-red-100 text-red-500"
          : "bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-red-100 hover:text-red-500"
      }`}
      aria-label={isSavedInitial ? "Batal simpan event" : "Simpan event"}
    >
      <FiHeart className={`w-5 h-5 ${isSavedInitial ? "fill-current" : ""}`} />
    </button>
  );
}
