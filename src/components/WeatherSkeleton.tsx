import { Skeleton } from "@/components/ui/skeleton";

const WeatherSkeleton = () => (
  <div className="max-w-xl mx-auto px-4 pt-8 space-y-4">
    {/* Search skeleton */}
    <Skeleton className="h-12 w-full rounded-2xl bg-muted/40" />

    {/* Header skeleton */}
    <div className="flex flex-col items-center gap-3 py-6">
      <Skeleton className="h-4 w-32 rounded-full bg-muted/40" />
      <Skeleton className="h-16 w-28 rounded-xl bg-muted/40" />
      <Skeleton className="h-4 w-20 rounded-full bg-muted/40" />
    </div>

    {/* Current weather card skeleton */}
    <Skeleton className="h-24 w-full rounded-2xl bg-muted/40" />

    {/* Details grid skeleton */}
    <div className="grid grid-cols-3 gap-3">
      <Skeleton className="h-24 rounded-2xl bg-muted/40" />
      <Skeleton className="h-24 rounded-2xl bg-muted/40" />
      <Skeleton className="h-24 rounded-2xl bg-muted/40" />
    </div>

    {/* Hourly forecast skeleton */}
    <Skeleton className="h-36 w-full rounded-2xl bg-muted/40" />

    {/* Daily forecast skeleton */}
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-xl bg-muted/40" />
      ))}
    </div>
  </div>
);

export default WeatherSkeleton;
