import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "@tanstack/react-router";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface DeleteAccountDialogProps {
  trigger: React.ReactNode;
}

export const DeleteAccountDialog = ({ trigger }: DeleteAccountDialogProps) => {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const result = await authClient.deleteUser({
        password,
      });
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
    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }
    deleteAccountMutation.mutate();
  };

  const handleClose = () => {
    if (!deleteAccountMutation.isPending) {
      setPassword("");
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Account
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              This action cannot be undone. This will permanently delete your account
              and all associated data including:
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

        <div className="space-y-2 py-4">
          <Label htmlFor="password">Confirm with password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={deleteAccountMutation.isPending}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteAccountMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteAccountMutation.isPending || !password.trim()}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteAccountMutation.isPending && (
              <Spinner className="mr-2" />
            )}
            Delete Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
