import { useInfiniteQuery } from "@tanstack/react-query";
import { orpc } from "@/orpc/client";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LinkCard } from "./link-card";
import { LinkListItem } from "./link-list-item";
import { EmptyLinks } from "./empty-links";
import { LinksSkeleton } from "./links-skeleton";
import { useState, useEffect } from "react";
import { Search, Grid3x3, List, Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";

type ViewMode = "grid" | "list";

export const LinksList = () => {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const { ref, inView } = useInView();

  const linksQuery = useInfiniteQuery(
    orpc.links.list.infiniteOptions({
      input: (pageParam) => ({
        offset: pageParam,
        search: search || undefined,
        limit: 20,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        if (lastPage.hasMore) {
          return lastPage.offset + lastPage.limit;
        }
        return undefined;
      },
    })
  );

  // Fetch next page when the sentinel element is in view
  useEffect(() => {
    if (inView && linksQuery.hasNextPage && !linksQuery.isFetchingNextPage) {
      linksQuery.fetchNextPage();
    }
  }, [inView, linksQuery]);

  // Get all links from all pages
  const allLinks = linksQuery.data?.pages.flatMap((page) => page.links) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <InputGroup className="flex-1 max-w-xs">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search links..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>

        <Tabs
          value={viewMode}
          onValueChange={(value) => setViewMode(value as ViewMode)}
        >
          <TabsList>
            <TabsTrigger value="grid">
              <Grid3x3 className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Links Content */}
      {linksQuery.isLoading && <LinksSkeleton viewMode={viewMode} />}

      {linksQuery.isError && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {linksQuery.error instanceof Error
              ? linksQuery.error.message
              : "Failed to load links"}
          </AlertDescription>
        </Alert>
      )}

      {linksQuery.isSuccess && (
        <>
          {allLinks.length === 0 ? (
            <EmptyLinks hasSearch={!!search} />
          ) : (
            <>
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    : "space-y-4"
                }
              >
                {allLinks.map((link) =>
                  viewMode === "grid" ? (
                    <LinkCard key={link.id} link={link} />
                  ) : (
                    <LinkListItem key={link.id} link={link} />
                  )
                )}
              </div>

              {/* Infinite scroll sentinel */}
              {linksQuery.hasNextPage && (
                <div
                  ref={ref}
                  className="flex items-center justify-center py-8"
                >
                  {linksQuery.isFetchingNextPage && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading more links...
                    </div>
                  )}
                </div>
              )}

              {/* Manual load more button (fallback) */}
              {!linksQuery.isFetchingNextPage && linksQuery.hasNextPage && (
                <div className="flex items-center justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => linksQuery.fetchNextPage()}
                  >
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
