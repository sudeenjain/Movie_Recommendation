import { Skeleton } from "@/components/ui/skeleton";

const MovieSkeleton = () => {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[2/3] w-full rounded-xl bg-white/5" />
      <Skeleton className="h-4 w-3/4 bg-white/5" />
      <Skeleton className="h-3 w-1/2 bg-white/5" />
    </div>
  );
};

export const MovieGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <MovieSkeleton key={i} />
    ))}
  </div>
);

export default MovieSkeleton;