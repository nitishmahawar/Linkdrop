import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

  return (
    <Card className={cn(isGridView ? "" : "flex")}>
      {isGridView ? (
        <>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <Skeleton className="h-5 w-5 rounded shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-32 w-full rounded-md" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </CardContent>
        </>
      ) : (
        <div className="flex items-center gap-4 p-4 w-full">
          <Skeleton className="h-5 w-5 rounded shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      )}
    </Card>
  );
};

export const LinksSkeleton = ({
  viewMode = "grid",
  count = 6,
}: LinkSkeletonProps) => {
  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          : "space-y-4"
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <SingleLinkSkeleton key={i} viewMode={viewMode} />
      ))}
    </div>
  );
};
