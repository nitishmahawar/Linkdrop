import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { orpc } from "@/orpc/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  notes: z.string().optional(),
  faviconUrl: z.string().url().optional().or(z.literal("")),
  previewImageUrl: z.string().url().optional().or(z.literal("")),
  isFavorite: z.boolean().optional(),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditLinkDialogProps {
  link: any; // TODO: Type this properly from ORPC
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditLinkDialog = ({
  link,
  open,
  onOpenChange,
}: EditLinkDialogProps) => {
  const [urlToFetch, setUrlToFetch] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: link.url || "",
      title: link.title || "",
      description: link.description || "",
      notes: link.notes || "",
      faviconUrl: link.faviconUrl || "",
      previewImageUrl: link.previewImageUrl || "",
      isFavorite: link.isFavorite || false,
      categoryIds: link.linkCategories?.map((lc: any) => lc.categoryId) || [],
      tagIds: link.linkTags?.map((lt: any) => lt.tagId) || [],
    },
  });

  // Reset form when link changes
  useEffect(() => {
    form.reset({
      url: link.url || "",
      title: link.title || "",
      description: link.description || "",
      notes: link.notes || "",
      faviconUrl: link.faviconUrl || "",
      previewImageUrl: link.previewImageUrl || "",
      isFavorite: link.isFavorite || false,
      categoryIds: link.linkCategories?.map((lc: any) => lc.categoryId) || [],
      tagIds: link.linkTags?.map((lt: any) => lt.tagId) || [],
    });
  }, [link, form]);

  // Fetch metadata using useQuery
  const metadataQuery = useQuery({
    ...orpc.metadata.fetch.queryOptions({
      input: { url: urlToFetch! },
    }),
    enabled: !!urlToFetch,
  });

  // Handle metadata query success/error with useEffect
  useEffect(() => {
    if (metadataQuery.isSuccess && urlToFetch) {
      const metadata = metadataQuery.data;
      if (metadata.title) form.setValue("title", metadata.title);
      if (metadata.description)
        form.setValue("description", metadata.description);
      if (metadata.faviconUrl) form.setValue("faviconUrl", metadata.faviconUrl);
      if (metadata.previewImageUrl)
        form.setValue("previewImageUrl", metadata.previewImageUrl);

      toast.success("Metadata fetched successfully!");
      setUrlToFetch(null);
    }

    if (metadataQuery.isError && urlToFetch) {
      toast.error("Failed to fetch metadata");
      setUrlToFetch(null);
    }
  }, [
    metadataQuery.isSuccess,
    metadataQuery.isError,
    metadataQuery.data,
    urlToFetch,
    form,
  ]);

  const updateMutation = useMutation(
    orpc.links.update.mutationOptions({
      onSuccess: () => {
        toast.success("Link updated successfully!");
        queryClient.invalidateQueries({ queryKey: orpc.links.list.key() });
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const handleFetchMetadata = () => {
    const url = form.getValues("url");
    if (!url) {
      toast.error("Please enter a URL first");
      return;
    }
    setUrlToFetch(url);
  };

  const onSubmit = (values: FormValues) => {
    updateMutation.mutate({
      id: link.id,
      ...values,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
          <DialogDescription>Update your link details</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* URL Field with Fetch Metadata Button */}
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL *</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="https://example.com"
                        {...field}
                        disabled={updateMutation.isPending}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleFetchMetadata}
                      disabled={
                        metadataQuery.isFetching || updateMutation.isPending
                      }
                    >
                      {metadataQuery.isFetching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <FormDescription>
                    Click the sparkle icon to auto-fetch metadata
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Link title"
                      {...field}
                      disabled={updateMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the link"
                      {...field}
                      disabled={updateMutation.isPending}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes Field */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Personal notes about this link"
                      {...field}
                      disabled={updateMutation.isPending}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Link
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
