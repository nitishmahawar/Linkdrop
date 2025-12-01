import { z } from "zod";

// Fetch Metadata Schema
export const fetchMetadataSchema = z.object({
  url: z.url({ error: "Invalid URL format" }),
});

// Metadata Response Schema
export const metadataResponseSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  faviconUrl: z.url().optional(),
  previewImageUrl: z.url().optional(),
  url: z.url(),
});

// Export types
export type FetchMetadataInput = z.infer<typeof fetchMetadataSchema>;
export type MetadataResponse = z.infer<typeof metadataResponseSchema>;
