import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/orpc/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  ExternalLink,
  MoreVertical,
  Star,
  StarOff,
  Edit,
  Trash2,
} from "lucide-react";
import { EditLinkDialog } from "./edit-link-dialog";
import { DeleteLinkDialog } from "./delete-link-dialog";
import type { Link } from "@/orpc/router/links";

interface LinkActionsMenuProps {
  link: Link;
}

export const LinkActionsMenu = ({ link }: LinkActionsMenuProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const queryClient = useQueryClient();

  const toggleFavoriteMutation = useMutation(
    orpc.links.toggleFavorite.mutationOptions({
      onSuccess: () => {
        toast.success(
          link.isFavorite ? "Removed from favorites" : "Added to favorites"
        );
        queryClient.invalidateQueries({ queryKey: orpc.links.list.key() });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const handleToggleFavorite = () => {
    toggleFavoriteMutation.mutate({
      id: link.id,
      isFavorite: !link.isFavorite,
    });
  };

  return (
    <>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleToggleFavorite}
          disabled={toggleFavoriteMutation.isPending}
        >
          <Star
            className={
              link.isFavorite ? "fill-yellow-400 text-yellow-400" : "h-4 w-4"
            }
          />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center cursor-pointer"
              >
                <ExternalLink />
                Open Link
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <Edit />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <EditLinkDialog link={link} open={editOpen} onOpenChange={setEditOpen} />
      <DeleteLinkDialog
        link={link}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
};
