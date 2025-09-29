"use client";

import { useState, useTransition } from "react";
import { FiHeart } from "react-icons/fi";
import { toggleSaveEvent } from "@/app/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SaveEventButtonProps {
  eventId: string;
  isSavedInitial: boolean;
  user: any;
}

export default function SaveEventButton({
  eventId,
  isSavedInitial,
  user,
}: SaveEventButtonProps) {
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    startTransition(async () => {
      // Optimistic UI update
      setIsSaved(!isSaved);

      const result = await toggleSaveEvent(eventId, isSaved);
      if (result?.error) {
        // Jika gagal, kembalikan state ke semula dan tampilkan error
        setIsSaved(isSaved);
        toast.error("Gagal", { description: result.error });
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`absolute top-3 right-3 p-2 rounded-full transition-colors duration-200 ${
        isSaved
          ? "bg-red-100 text-red-500"
          : "bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-red-100 hover:text-red-500"
      }`}
      aria-label={isSaved ? "Batal simpan event" : "Simpan event"}
    >
      <FiHeart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
    </button>
  );
}
