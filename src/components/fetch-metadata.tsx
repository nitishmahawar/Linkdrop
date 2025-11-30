import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { orpc } from "@/orpc/client";
import { Button } from "@/components/ui/button";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
});

type FormValues = z.infer<typeof formSchema>;

export const FetchMetadata = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const mutation = useMutation(
    orpc.metadata.fetch.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const onSubmit = (values: FormValues) => {
    mutation.mutate({ url: values.url });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Metadata Fetcher</CardTitle>
          <CardDescription>
            Enter a URL to fetch its metadata (title, description, favicon, and
            preview image)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com"
                        {...field}
                        disabled={mutation.isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the URL you want to fetch metadata from
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full"
              >
                {mutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {mutation.isPending ? "Fetching..." : "Fetch Metadata"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {mutation.isError && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {mutation.error instanceof Error
              ? mutation.error.message
              : "Failed to fetch metadata"}
          </AlertDescription>
        </Alert>
      )}

      {mutation.isSuccess && mutation.data && (
        <Card>
          <CardHeader>
            <CardTitle>Metadata Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                Title
              </label>
              <p className="text-base">
                {mutation.data.title || (
                  <span className="text-muted-foreground italic">
                    No title found
                  </span>
                )}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                Description
              </label>
              <p className="text-sm">
                {mutation.data.description || (
                  <span className="text-muted-foreground italic">
                    No description found
                  </span>
                )}
              </p>
            </div>

            {/* Favicon */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                Favicon
              </label>
              {mutation.data.faviconUrl ? (
                <div className="flex items-center gap-2">
                  <img
                    src={mutation.data.faviconUrl}
                    alt="Favicon"
                    className="w-6 h-6"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <a
                    href={mutation.data.faviconUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline truncate"
                  >
                    {mutation.data.faviconUrl}
                  </a>
                </div>
              ) : (
                <span className="text-muted-foreground italic text-sm">
                  No favicon found
                </span>
              )}
            </div>

            {/* Preview Image */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                Preview Image
              </label>
              {mutation.data.previewImageUrl ? (
                <div className="space-y-2">
                  <img
                    src={mutation.data.previewImageUrl}
                    alt="Preview"
                    className="w-full max-w-md rounded-md border border-border"
                    onError={(e) => {
                      e.currentTarget.src = "";
                      e.currentTarget.alt = "Failed to load image";
                    }}
                  />
                  <a
                    href={mutation.data.previewImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline break-all"
                  >
                    {mutation.data.previewImageUrl}
                  </a>
                </div>
              ) : (
                <span className="text-muted-foreground italic text-sm">
                  No preview image found
                </span>
              )}
            </div>

            {/* Original URL */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                URL
              </label>
              <a
                href={mutation.data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline break-all"
              >
                {mutation.data.url}
              </a>
            </div>

            {/* Raw JSON */}
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                View Raw JSON
              </summary>
              <pre className="mt-2 p-4 bg-muted rounded-md text-xs overflow-x-auto">
                {JSON.stringify(mutation.data, null, 2)}
              </pre>
            </details>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
