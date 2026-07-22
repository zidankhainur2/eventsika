import { Skeleton } from "@/components/ui/skeleton";

export default function EventCardSkeleton() {
  return (
    <div className="border-2 border-[#E8E8E8] rounded-xl overflow-hidden bg-white">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="p-4 flex flex-col gap-3">
        <Skeleton className="h-3 w-1/4" /> {/* tanggal */}
        <Skeleton className="h-5 w-full" /> {/* judul baris 1 */}
        <Skeleton className="h-5 w-3/4" /> {/* judul baris 2 */}
        <Skeleton className="h-3 w-1/2" /> {/* lokasi */}
        <Skeleton className="h-3 w-1/3" /> {/* organizer */}
        <Skeleton className="h-10 w-full mt-1 rounded-lg" /> {/* button */}
      </div>
    </div>
  );
}
