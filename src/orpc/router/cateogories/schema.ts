import { z } from "zod";

// Create Category Schema
export const createCategorySchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
  color: z.string().optional(),
});

// Update Category Schema
export const updateCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Category name is required" }).optional(),
  color: z.string().optional().nullable(),
});

// Get Category by ID Schema
export const getCategoryByIdSchema = z.object({
  id: z.string(),
});

// Delete Category Schema
export const deleteCategorySchema = z.object({
  id: z.string(),
});

// Get All Categories Schema
export const getCategoriesSchema = z.object({
  search: z.string().optional(),
});

// Export types
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type GetCategoryByIdInput = z.infer<typeof getCategoryByIdSchema>;
export type DeleteCategoryInput = z.infer<typeof deleteCategorySchema>;
export type GetCategoriesInput = z.infer<typeof getCategoriesSchema>;
