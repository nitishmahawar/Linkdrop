import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Key } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface ChangePasswordDialogProps {
  trigger: React.ReactNode;
}

export const ChangePasswordDialog = ({ trigger }: ChangePasswordDialogProps) => {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(true);

  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      if (newPassword !== confirmPassword) {
        throw new Error("New passwords do not match");
      }

      if (newPassword.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      const { data, error } = await authClient.changePassword({
        newPassword,
        currentPassword,
        revokeOtherSessions,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Password changed successfully");
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to change password");
    },
  });

  const handleSubmit = () => {
    if (!currentPassword.trim()) {
      toast.error("Current password is required");
      return;
    }
    if (!newPassword.trim()) {
      toast.error("New password is required");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    changePasswordMutation.mutate();
  };

  const handleClose = () => {
    if (!changePasswordMutation.isPending) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setRevokeOtherSessions(true);
      setOpen(false);
    }
  };

  const isFormValid =
    currentPassword.trim() &&
    newPassword.trim() &&
    confirmPassword.trim() &&
    newPassword === confirmPassword;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Change Password
          </DialogTitle>
          <DialogDescription>
            Enter your current password and a new password to update your account
            security.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={changePasswordMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={changePasswordMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={changePasswordMutation.isPending}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="revoke-sessions"
              checked={revokeOtherSessions}
              onCheckedChange={(checked) => setRevokeOtherSessions(checked as boolean)}
              disabled={changePasswordMutation.isPending}
            />
            <Label htmlFor="revoke-sessions" className="text-sm">
              Sign out from all other devices
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={changePasswordMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={changePasswordMutation.isPending || !isFormValid}
          >
            {changePasswordMutation.isPending && (
              <Spinner className="mr-2" />
            )}
            Change Password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
