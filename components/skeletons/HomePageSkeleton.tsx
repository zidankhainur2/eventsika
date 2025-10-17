function EventCarouselSkeleton() {
  return (
    <div className="mb-12">
      <div className="h-8 w-1/2 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden border">
            <div className="h-44 w-full bg-gray-200"></div>
            <div className="p-4 bg-white">
              <div className="h-4 w-1/4 bg-gray-200 rounded-md mb-2"></div>
              <div className="h-6 w-full bg-gray-200 rounded-md mb-3"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePageSkeleton() {
  return (
    <div className="mt-4 space-y-8">
      <EventCarouselSkeleton />
      <EventCarouselSkeleton />
      <EventCarouselSkeleton />
    </div>
  );
}
