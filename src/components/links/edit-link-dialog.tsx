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
import { Sparkles, Plus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import type { Link } from "@/orpc/router/links";
import { Card } from "@/components/ui/card";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectSeparator,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import { CreateCategoryDialog } from "@/components/categories/create-category-dialog";
import { CreateTagDialog } from "@/components/tags/create-tag-dialog";

const formSchema = z.object({
  url: z.url({ error: "Please enter a valid URL" }),
  title: z.string().min(1, { error: "Title is required" }),
  description: z.string().optional(),
  notes: z.string().optional(),
  faviconUrl: z.url().optional().or(z.literal("")),
  previewImageUrl: z.url().optional().or(z.literal("")),
  isFavorite: z.boolean().optional(),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditLinkDialogProps {
  link: Link;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditLinkDialog = ({
  link,
  open,
  onOpenChange,
}: EditLinkDialogProps) => {
  const [urlToFetch, setUrlToFetch] = useState<string | null>(null);
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);
  const [createTagOpen, setCreateTagOpen] = useState(false);
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

  // Fetch categories
  const categoriesQuery = useQuery(
    orpc.categories.list.queryOptions({
      input: {},
    })
  );

  // Fetch tags
  const tagsQuery = useQuery(
    orpc.tags.list.queryOptions({
      input: {},
    })
  );

  // Fetch metadata using useQuery
  const metadataQuery = useQuery({
    ...orpc.metadata.fetch.queryOptions({
      input: { url: urlToFetch! },
    }),
    enabled: !!urlToFetch,
  });

  // Handle metadata query success/error with useEffect (silent, no toasts)
  useEffect(() => {
    if (metadataQuery.isSuccess && urlToFetch) {
      const metadata = metadataQuery.data;
      if (metadata.title) form.setValue("title", metadata.title);
      if (metadata.description)
        form.setValue("description", metadata.description);
      if (metadata.faviconUrl) form.setValue("faviconUrl", metadata.faviconUrl);
      if (metadata.previewImageUrl)
        form.setValue("previewImageUrl", metadata.previewImageUrl);

      setUrlToFetch(null);
    }

    if (metadataQuery.isError && urlToFetch) {
      // Silently fail - no toast notification
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
      return;
    }
    setUrlToFetch(url);
  };

  // Auto-fetch metadata on URL paste
  const handleUrlPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedUrl = e.clipboardData.getData("text");
    if (pastedUrl && pastedUrl.startsWith("http")) {
      // Wait for the input value to update, then fetch metadata
      setTimeout(() => {
        setUrlToFetch(pastedUrl);
      }, 100);
    }
  };

  const onSubmit = (values: FormValues) => {
    // Transform empty strings to undefined for optional URL fields
    const payload = {
      id: link.id,
      ...values,
      faviconUrl: values.faviconUrl || undefined,
      previewImageUrl: values.previewImageUrl || undefined,
    };
    updateMutation.mutate(payload);
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
                        onPaste={handleUrlPaste}
                        disabled={updateMutation.isPending}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleFetchMetadata}
                      disabled={
                        !field.value ||
                        metadataQuery.isFetching ||
                        updateMutation.isPending
                      }
                    >
                      {metadataQuery.isFetching ? (
                        <Spinner />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <FormDescription>
                    Paste a URL to auto-fetch metadata, or click the sparkle
                    icon
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Metadata Preview */}
            {(form.watch("faviconUrl") || form.watch("previewImageUrl")) && (
              <Card className="p-4">
                <div className="flex items-start gap-4">
                  {form.watch("faviconUrl") && (
                    <img
                      src={form.watch("faviconUrl")}
                      alt="Favicon"
                      className="h-8 w-8 shrink-0 rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="font-medium text-sm line-clamp-1">
                      {form.watch("title") || "No title"}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {form.watch("description") || "No description"}
                    </p>
                  </div>
                  {form.watch("previewImageUrl") && (
                    <img
                      src={form.watch("previewImageUrl")}
                      alt="Preview"
                      className="h-16 w-24 shrink-0 rounded object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                </div>
              </Card>
            )}

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

            {/* Categories Multi-Select */}
            <FormField
              control={form.control}
              name="categoryIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <FormControl>
                    <MultiSelect
                      values={field.value}
                      onValuesChange={field.onChange}
                    >
                      <MultiSelectTrigger className="w-full">
                        <MultiSelectValue placeholder="Select categories..." />
                      </MultiSelectTrigger>
                      <MultiSelectContent
                        search={{
                          placeholder: "Search categories...",
                          emptyMessage: "No categories found",
                        }}
                      >
                        <MultiSelectGroup>
                          {categoriesQuery.data?.map((category) => (
                            <MultiSelectItem
                              key={category.id}
                              value={category.id}
                            >
                              <div
                                data-slot="color"
                                className="size-2.5 rounded-full"
                                style={{ backgroundColor: category.color! }}
                              ></div>
                              {category.name}
                            </MultiSelectItem>
                          ))}
                        </MultiSelectGroup>
                        <MultiSelectSeparator />
                        <MultiSelectGroup>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="w-full"
                            onClick={() => setCreateCategoryOpen(true)}
                          >
                            <Plus className="h-4 w-4" />
                            New Category
                          </Button>
                        </MultiSelectGroup>
                      </MultiSelectContent>
                    </MultiSelect>
                  </FormControl>
                  <FormDescription>
                    Organize your link with categories
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags Multi-Select */}
            <FormField
              control={form.control}
              name="tagIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <MultiSelect
                      values={field.value}
                      onValuesChange={field.onChange}
                    >
                      <MultiSelectTrigger className="w-full">
                        <MultiSelectValue placeholder="Select tags..." />
                      </MultiSelectTrigger>
                      <MultiSelectContent
                        search={{
                          placeholder: "Search tags...",
                          emptyMessage: "No tags found",
                        }}
                      >
                        <MultiSelectGroup>
                          {tagsQuery.data?.map((tag) => (
                            <MultiSelectItem key={tag.id} value={tag.id}>
                              {tag.name}
                            </MultiSelectItem>
                          ))}
                        </MultiSelectGroup>
                        <MultiSelectSeparator />
                        <MultiSelectGroup>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="w-full"
                            onClick={() => setCreateTagOpen(true)}
                          >
                            <Plus className="h-4 w-4" />
                            New Tag
                          </Button>
                        </MultiSelectGroup>
                      </MultiSelectContent>
                    </MultiSelect>
                  </FormControl>
                  <FormDescription>
                    Add tags to help find this link later
                  </FormDescription>
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
                {updateMutation.isPending && <Spinner />}
                Update Link
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>

      {/* Create Category Dialog */}
      <CreateCategoryDialog
        open={createCategoryOpen}
        onOpenChange={setCreateCategoryOpen}
      />

      {/* Create Tag Dialog */}
      <CreateTagDialog open={createTagOpen} onOpenChange={setCreateTagOpen} />
    </Dialog>
  );
};
