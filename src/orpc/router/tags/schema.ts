import { z } from "zod";

// Create Tag Schema
export const createTagSchema = z.object({
  name: z.string().min(1, { message: "Tag name is required" }),
});

// Update Tag Schema
export const updateTagSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Tag name is required" }),
});

// Get Tag by ID Schema
export const getTagByIdSchema = z.object({
  id: z.string(),
});

// Delete Tag Schema
export const deleteTagSchema = z.object({
  id: z.string(),
});

// Get All Tags Schema
export const getTagsSchema = z.object({
  search: z.string().optional(),
});

// Export types
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export type GetTagByIdInput = z.infer<typeof getTagByIdSchema>;
export type DeleteTagInput = z.infer<typeof deleteTagSchema>;
export type GetTagsInput = z.infer<typeof getTagsSchema>;
