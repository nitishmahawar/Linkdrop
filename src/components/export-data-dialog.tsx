import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { orpc } from "@/orpc/client";
import { toast } from "sonner";
import { Download, FileJson } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useRouteContext } from "@tanstack/react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";

interface ExportDataDialogProps {
  trigger: React.ReactNode;
}

export const ExportDataDialog = ({ trigger }: ExportDataDialogProps) => {
  const [open, setOpen] = useState(false);
  const { user } = useRouteContext({ from: "/(app)/account" });

  const exportDataMutation = useMutation(
    orpc.user.exportData.mutationOptions({
      onSuccess: (exportResponse) => {
        // Prepare export data
        const exportData = {
          exportedAt: exportResponse.exportedAt,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          data: {
            links: exportResponse.links,
            categories: exportResponse.categories,
            tags: exportResponse.tags,
          },
          metadata: {
            totalLinks: exportResponse.links.length,
            totalCategories: exportResponse.categories.length,
            totalTags: exportResponse.tags.length,
          },
        };

        // Create a blob from the JSON data
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: "application/json",
        });

        // Create a download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `linkdrop-export-${
          new Date().toISOString().split("T")[0]
        }.json`;

        // Trigger download
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success("Your data has been exported successfully");
        setOpen(false);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to export data");
      },
    })
  );

  const handleExport = () => {
    exportDataMutation.mutate({});
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5 text-primary" />
            Export Your Data
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Download all your Linkdrop data in JSON format. This includes:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground ml-2">
              <li>All your saved links</li>
              <li>Categories and tags</li>
              <li>Metadata and timestamps</li>
            </ul>
            <p className="text-sm">
              The exported file can be used for backup or importing into other
              services.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={exportDataMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={handleExport}
              disabled={exportDataMutation.isPending}
            >
              {exportDataMutation.isPending ? <Spinner /> : <Download />}
              Export Data
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
