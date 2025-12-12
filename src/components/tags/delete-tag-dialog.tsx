import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/orpc/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface DeleteTagDialogProps {
  tag: {
    id: string;
    name: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteTagDialog = ({
  tag,
  open,
  onOpenChange,
}: DeleteTagDialogProps) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    orpc.tags.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Tag deleted successfully!");
        queryClient.invalidateQueries({ queryKey: orpc.tags.list.key() });
        queryClient.invalidateQueries({ queryKey: orpc.links.list.key() });
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const handleDelete = () => {
    deleteMutation.mutate({ id: tag.id });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-120">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Tag</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the tag{" "}
            <span className="font-semibold text-foreground">"#{tag.name}"</span>
            ? This action cannot be undone. Links with this tag will not be
            deleted, but they will lose this tag.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending && <Spinner />}
            Delete Tag
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
