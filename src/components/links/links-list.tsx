import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/orpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LinkCard } from "./link-card";
import { LinkListItem } from "./link-list-item";
import { EmptyLinks } from "./empty-links";
import { LinksSkeleton } from "./links-skeleton";
import { useState } from "react";
import { Search, Grid3x3, List } from "lucide-react";

type ViewMode = "grid" | "list";

export const LinksList = () => {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const linksQuery = useQuery(
    orpc.links.list.queryOptions({
      input: {
        search: search || undefined,
        limit: 50,
        offset: 0,
        sortBy: "createdAt",
        sortOrder: "desc",
      },
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search links..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

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
          {linksQuery.data.links.length === 0 ? (
            <EmptyLinks hasSearch={!!search} />
          ) : (
            <>
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "space-y-4"
                }
              >
                {linksQuery.data.links.map((link) =>
                  viewMode === "grid" ? (
                    <LinkCard key={link.id} link={link} />
                  ) : (
                    <LinkListItem key={link.id} link={link} />
                  )
                )}
              </div>

              {/* Pagination Info */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <p>
                  Showing {linksQuery.data.links.length} of{" "}
                  {linksQuery.data.total} links
                </p>
                {linksQuery.data.hasMore && (
                  <Button variant="outline" size="sm">
                    Load More
                  </Button>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
