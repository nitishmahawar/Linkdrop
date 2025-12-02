import { CreateLinkDialog, LinksList } from "@/components/links";
import { ManageDialog } from "@/components/manage-dialog";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">My Links</h1>
          <p className="text-muted-foreground">
            Manage your saved links and bookmarks
          </p>
        </div>
        <div className="flex gap-2">
          <CreateLinkDialog />
          <ManageDialog />
        </div>
      </div>
      <LinksList />
    </div>
  );
}
