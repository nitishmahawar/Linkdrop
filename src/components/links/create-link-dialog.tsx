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
  DialogTrigger,
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
import { Link as LinkIcon, Sparkles } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

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

interface CreateLinkDialogProps {
  trigger?: React.ReactNode;
}

export const CreateLinkDialog = ({ trigger }: CreateLinkDialogProps) => {
  const [open, setOpen] = useState(false);
  const [urlToFetch, setUrlToFetch] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      title: "",
      description: "",
      notes: "",
      faviconUrl: "",
      previewImageUrl: "",
      isFavorite: false,
      categoryIds: [],
      tagIds: [],
    },
  });

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

  const createMutation = useMutation(
    orpc.links.create.mutationOptions({
      onSuccess: () => {
        toast.success("Link created successfully!");
        queryClient.invalidateQueries({ queryKey: orpc.links.list.key() });
        setOpen(false);
        form.reset();
      },
      onError: (error) => {
        console.log(error);
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
    // Transform empty strings to undefined for optional URL fields
    const payload = {
      ...values,
      faviconUrl: values.faviconUrl || undefined,
      previewImageUrl: values.previewImageUrl || undefined,
    };
    createMutation.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <LinkIcon />
            Add Link
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Link</DialogTitle>
          <DialogDescription>
            Save a URL with title, description, and notes
          </DialogDescription>
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
                        disabled={createMutation.isPending}
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
                        createMutation.isPending
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
                      disabled={createMutation.isPending}
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
                      disabled={createMutation.isPending}
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
                      disabled={createMutation.isPending}
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
                onClick={() => setOpen(false)}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending && <Spinner />}
                Create Link
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
