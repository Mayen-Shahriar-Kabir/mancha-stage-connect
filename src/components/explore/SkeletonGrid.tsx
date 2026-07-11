import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonGrid({ count = 8, variant = "show" }: { count?: number; variant?: "show" | "artist" | "group" }) {
  return (
    <div
      className={
        variant === "artist"
          ? "grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
        >
          <Skeleton
            className={
              variant === "artist"
                ? "aspect-square w-full shimmer rounded-none"
                : "aspect-[4/5] w-full shimmer rounded-none"
            }
          />
          <div className="space-y-3 p-5">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-9 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
