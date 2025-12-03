import { z } from "zod";

// Create Link Schema
export const createLinkSchema = z.object({
  url: z.url({ error: "Invalid URL format" }),
  title: z.string().min(1, { error: "Title is required" }),
  description: z.string().optional(),
  notes: z.string().optional(),
  faviconUrl: z.url().optional(),
  previewImageUrl: z.url().optional(),
  isFavorite: z.boolean().default(false),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
});

// Update Link Schema
export const updateLinkSchema = z.object({
  id: z.string(),
  url: z.url({ error: "Invalid URL format" }).optional(),
  title: z.string().min(1, { error: "Title is required" }).optional(),
  description: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  faviconUrl: z.url().optional().nullable(),
  previewImageUrl: z.url().optional().nullable(),
  isFavorite: z.boolean().optional(),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
});

// Get Link by ID Schema
export const getLinkByIdSchema = z.object({
  id: z.string(),
});

// Delete Link Schema
export const deleteLinkSchema = z.object({
  id: z.string(),
});

// Get All Links Schema (with filters)
export const getLinksSchema = z.object({
  search: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  isFavorite: z.boolean().optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
  sortBy: z.enum(["createdAt", "updatedAt", "title"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Toggle Favorite Schema
export const toggleFavoriteSchema = z.object({
  id: z.string(),
  isFavorite: z.boolean(),
});

// Bulk Delete Schema
export const bulkDeleteLinksSchema = z.object({
  ids: z
    .array(z.string())
    .min(1, { error: "At least one link ID is required" }),
});

// Export types
export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;
export type GetLinkByIdInput = z.infer<typeof getLinkByIdSchema>;
export type DeleteLinkInput = z.infer<typeof deleteLinkSchema>;
export type GetLinksInput = z.infer<typeof getLinksSchema>;
export type ToggleFavoriteInput = z.infer<typeof toggleFavoriteSchema>;
export type BulkDeleteLinksInput = z.infer<typeof bulkDeleteLinksSchema>;
