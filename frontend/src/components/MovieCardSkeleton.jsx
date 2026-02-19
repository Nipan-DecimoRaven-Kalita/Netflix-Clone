export function MovieCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] animate-pulse">
      <div className="aspect-[2/3] rounded bg-gray-700" />
      <div className="mt-2 h-3 bg-gray-700 rounded w-3/4" />
      <div className="mt-1 h-3 bg-gray-700 rounded w-1/2" />
    </div>
  );
}
