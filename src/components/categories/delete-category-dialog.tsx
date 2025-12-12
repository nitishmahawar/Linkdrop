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

interface DeleteCategoryDialogProps {
  category: {
    id: string;
    name: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteCategoryDialog = ({
  category,
  open,
  onOpenChange,
}: DeleteCategoryDialogProps) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    orpc.categories.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Category deleted successfully!");
        queryClient.invalidateQueries({ queryKey: orpc.categories.list.key() });
        queryClient.invalidateQueries({ queryKey: orpc.links.list.key() });
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const handleDelete = () => {
    deleteMutation.mutate({ id: category.id });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-120">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the category{" "}
            <span className="font-semibold text-foreground">
              "{category.name}"
            </span>
            ? This action cannot be undone. Links in this category will not be
            deleted, but they will be uncategorized.
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
            Delete Category
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
