import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("bg-muted rounded animate-pulse", className)} />;
}

interface SkeletonLoaderProps {
  type?: "table" | "card" | "list" | "text";
  count?: number;
}

export function SkeletonLoader({
  type = "card",
  count = 3,
}: SkeletonLoaderProps) {
  if (type === "table") {
    return (
      <div className="space-y-4">
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="flex gap-4 p-4 border border-border rounded-lg"
          >
            <Skeleton className="h-12 w-12 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="p-6 border border-border rounded-lg">
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="space-y-2">
        {[...Array(count)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  // text
  return (
    <div className="space-y-2">
      {[...Array(count)].map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === count - 1 ? "w-2/3" : "w-full"}`}
        />
      ))}
    </div>
  );
}
