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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Upload, User } from "lucide-react";
import { useRouteContext } from "@tanstack/react-router";
import { Spinner } from "@/components/ui/spinner";

interface EditAccountDialogProps {
  trigger: React.ReactNode;
}

export const EditAccountDialog = ({ trigger }: EditAccountDialogProps) => {
  const [open, setOpen] = useState(false);
  const { user } = useRouteContext({ from: "__root__" });
  const [name, setName] = useState(user.name);
  const [email] = useState(user.email);
  const [imageUrl, setImageUrl] = useState(user.image || "");

  const updateAccountMutation = useMutation({
    mutationFn: async () => {
      const updateData: any = {
        name: name.trim(),
      };

      if (imageUrl.trim() && imageUrl !== user.image) {
        updateData.image = imageUrl.trim();
      }

      const { data, error } = await authClient.updateUser(updateData);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Account updated successfully");
      window.location.reload(); // Reload to get updated user context
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update account");
    },
  });

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    updateAccountMutation.mutate();
  };

  const handleClose = () => {
    if (!updateAccountMutation.isPending) {
      setName(user.name);
      setImageUrl(user.image || "");
      setOpen(false);
    }
  };

  const isFormValid =
    name.trim() !== user.name || imageUrl.trim() !== (user.image || "");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit Account
          </DialogTitle>
          <DialogDescription>
            Update your account information and profile picture.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Profile Preview */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={imageUrl || user.image!} alt={name} />
              <AvatarFallback className="text-lg">
                {(name || user.name).slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Profile Preview</p>
              <p className="font-medium">{name || user.name}</p>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={updateAccountMutation.isPending}
            />
          </div>

          {/* Email Field (Readonly) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed here. Contact support if needed.
            </p>
          </div>

          {/* Profile Picture URL */}
          <div className="space-y-2">
            <Label htmlFor="image-url">Profile Picture URL</Label>
            <div className="flex gap-2">
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={updateAccountMutation.isPending}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enter a URL to your profile picture. Leave empty to remove.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={updateAccountMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={updateAccountMutation.isPending || !isFormValid}
          >
            {updateAccountMutation.isPending && <Spinner className="mr-2" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
