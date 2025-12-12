import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface DeleteAccountDialogProps {
  trigger: React.ReactNode;
}

export const DeleteAccountDialog = ({ trigger }: DeleteAccountDialogProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const result = await authClient.deleteUser();
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Your account has been deleted successfully");
      navigate({ to: "/login" });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete account");
    },
  });

  const handleDelete = () => {
    deleteAccountMutation.mutate();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Account
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              This action cannot be undone. This will permanently delete your
              account and all associated data including:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground ml-2">
              <li>All your saved links</li>
              <li>Categories and tags</li>
              <li>Account settings and preferences</li>
            </ul>
            <p className="font-semibold text-destructive">
              This action is irreversible.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteAccountMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteAccountMutation.isPending}
          >
            {deleteAccountMutation.isPending && <Spinner className="mr-2" />}
            Delete Account
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
