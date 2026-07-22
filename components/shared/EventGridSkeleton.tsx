import EventCardSkeleton from "./EventCardSkeleton";

interface EventGridSkeletonProps {
  count?: number;
}

export default function EventGridSkeleton({ count = 4 }: EventGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}