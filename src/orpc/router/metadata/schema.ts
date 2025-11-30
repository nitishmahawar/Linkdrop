import { z } from "zod";

// Fetch Metadata Schema
export const fetchMetadataSchema = z.object({
  url: z.string().url({ message: "Invalid URL format" }),
});

// Metadata Response Schema
export const metadataResponseSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  faviconUrl: z.string().url().optional(),
  previewImageUrl: z.string().url().optional(),
  url: z.string().url(),
});

// Export types
export type FetchMetadataInput = z.infer<typeof fetchMetadataSchema>;
export type MetadataResponse = z.infer<typeof metadataResponseSchema>;
