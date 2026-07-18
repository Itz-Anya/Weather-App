import { Skeleton } from "@/components/ui/skeleton";

const shimmer =
  "bg-muted/70 border border-[hsl(var(--glass-border))] backdrop-blur-lg shadow-glass";

const block = `${shimmer} overflow-hidden`;

const WeatherSkeleton = () => (
  <div className="space-y-4">
    <div className="flex flex-col items-center gap-3 py-6">
      <Skeleton className={`h-4 w-40 rounded-full ${shimmer}`} />
      <Skeleton className={`h-20 w-40 rounded-2xl ${shimmer}`} />
      <Skeleton className={`h-4 w-24 rounded-full ${shimmer}`} />
      <Skeleton className={`h-3 w-56 rounded-full ${shimmer}`} />
    </div>

    <Skeleton className={`h-28 w-full rounded-2xl ${block}`} />

    <div className={`rounded-2xl p-4 ${block}`}>
      <Skeleton className={`h-4 w-32 mb-3 rounded-full ${shimmer}`} />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className={`h-24 rounded-xl ${shimmer}`} />
        ))}
      </div>
    </div>

    <div className={`rounded-2xl overflow-hidden ${block}`}>
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <Skeleton className={`h-4 w-24 rounded-full ${shimmer}`} />
        <Skeleton className={`h-3 w-20 rounded-full ${shimmer}`} />
      </div>
      <Skeleton className="h-72 w-full rounded-none bg-muted/80" />
    </div>

    <Skeleton className={`h-52 w-full rounded-2xl ${block}`} />
    <Skeleton className={`h-40 w-full rounded-2xl ${block}`} />

    <div className={`rounded-2xl p-4 space-y-2 ${block}`}>
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className={`h-12 w-full rounded-xl ${shimmer}`} />
      ))}
    </div>

    <Skeleton className={`h-32 w-full rounded-2xl ${block}`} />
    <Skeleton className={`h-28 w-full rounded-2xl ${block}`} />
    <Skeleton className={`h-28 w-full rounded-2xl ${block}`} />
  </div>
);

export default WeatherSkeleton;
