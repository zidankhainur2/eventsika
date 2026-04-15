"use client";

export default function EventCardSkeleton() {
  return (
    <div className="w-[280px] sm:w-full flex-shrink-0 animate-pulse">
      <div className="bg-white dark:bg-card rounded-3xl overflow-hidden border border-stone-100 dark:border-border shadow-sm flex flex-col h-full">
        {/* Area Gambar Skeleton */}
        <div className="p-2">
          <div className="h-48 w-full bg-stone-200 dark:bg-stone-800 rounded-2xl relative">
            {/* Badge Placeholder */}
            <div className="absolute top-3 left-3 h-6 w-20 bg-stone-300 dark:bg-stone-700 rounded-lg"></div>
          </div>
        </div>

        {/* Area Konten Skeleton */}
        <div className="p-5 space-y-4 flex-grow">
          <div className="space-y-2">
            {/* Judul Baris 1 & 2 */}
            <div className="h-5 w-full bg-stone-200 dark:bg-stone-800 rounded-md"></div>
            <div className="h-5 w-3/4 bg-stone-200 dark:bg-stone-800 rounded-md"></div>
          </div>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-50 dark:border-border/50">
            {/* Info Tanggal */}
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-stone-200 dark:bg-stone-800 rounded-full"></div>
              <div className="h-4 w-24 bg-stone-200 dark:bg-stone-800 rounded-md"></div>
            </div>
            {/* Tombol Detail Placeholder */}
            <div className="h-8 w-16 bg-stone-200 dark:bg-stone-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
