import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LinkSkeletonProps {
  viewMode?: "grid" | "list";
  count?: number;
}

const SingleLinkSkeleton = ({
  viewMode = "grid",
}: {
  viewMode: "grid" | "list";
}) => {
  const isGridView = viewMode === "grid";

  if (isGridView) {
    return (
      <Card className="overflow-hidden pt-0">
        {/* Preview Image Skeleton */}
        <Skeleton className="h-48 w-full rounded-none" />

        <CardContent className="space-y-4">
          {/* Header: Favicon + Title/URL + Actions */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Favicon */}
              <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                {/* Title */}
                <Skeleton className="h-4 w-3/4" />
                {/* URL */}
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            {/* Actions */}
            <Skeleton className="h-8 w-8 rounded" />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>

          {/* Badges */}
          <div className="flex gap-1.5">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // List view skeleton
  return (
    <Card className="flex items-center gap-4 p-4">
      {/* Favicon */}
      <Skeleton className="w-10 h-10 rounded-lg shrink-0" />

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/3" />
      </div>

      {/* Badges & Actions */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </Card>
  );
};

export const LinksSkeleton = ({
  viewMode = "grid",
  count = 6,
}: LinkSkeletonProps) => {
  return (
    <div
      className={cn(
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          : "space-y-4"
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SingleLinkSkeleton key={i} viewMode={viewMode} />
      ))}
    </div>
  );
};
