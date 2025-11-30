import { CreateLinkDialog, LinksList } from "@/components/links";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">My Links</h1>
          <p className="text-muted-foreground">
            Manage your saved links and bookmarks
          </p>
        </div>
        <CreateLinkDialog />
      </div>
      <LinksList />
    </div>
  );
}
