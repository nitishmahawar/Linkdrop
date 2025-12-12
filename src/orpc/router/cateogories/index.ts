import { protectedProcedure } from "@/orpc";
import { db, categories } from "@/db";
import { InferRouterOutputs, ORPCError } from "@orpc/server";
import { eq, and, ilike, desc } from "drizzle-orm";
import {
  createCategorySchema,
  updateCategorySchema,
  getCategoryByIdSchema,
  deleteCategorySchema,
  getCategoriesSchema,
} from "./schema";

// Export the categories router
export const categoriesRouter = {
  // Create a new category
  create: protectedProcedure
    .input(createCategorySchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      const [category] = await db
        .insert(categories)
        .values({
          ...input,
          userId,
        })
        .returning();

      // Fetch with relations
      const result = await db.query.categories.findFirst({
        where: eq(categories.id, category.id),
        with: {
          linkCategories: {
            with: {
              link: true,
            },
          },
        },
      });

      return result!;
    }),

  // Get all categories
  list: protectedProcedure
    .input(getCategoriesSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const { search } = input;

      const conditions = [eq(categories.userId, userId)];

      if (search) {
        conditions.push(ilike(categories.name, `%${search}%`));
      }

      const result = await db.query.categories.findMany({
        where: and(...conditions),
        orderBy: desc(categories.createdAt),
      });

      return result;
    }),

  // Get category by ID
  get: protectedProcedure
    .input(getCategoryByIdSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      const category = await db.query.categories.findFirst({
        where: and(eq(categories.id, input.id), eq(categories.userId, userId)),
        with: {
          linkCategories: {
            with: {
              link: true,
            },
          },
        },
      });

      if (!category) {
        throw new ORPCError("NOT_FOUND", { message: "Category not found" });
      }

      return category;
    }),

  // Update category
  update: protectedProcedure
    .input(updateCategorySchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const { id, ...updateData } = input;

      // Check if category exists and belongs to user
      const existingCategory = await db.query.categories.findFirst({
        where: and(eq(categories.id, id), eq(categories.userId, userId)),
      });

      if (!existingCategory) {
        throw new ORPCError("NOT_FOUND", { message: "Category not found" });
      }

      await db.update(categories).set(updateData).where(eq(categories.id, id));

      const category = await db.query.categories.findFirst({
        where: eq(categories.id, id),
        with: {
          linkCategories: {
            with: {
              link: true,
            },
          },
        },
      });

      return category!;
    }),

  // Delete category
  delete: protectedProcedure
    .input(deleteCategorySchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      // Check if category exists and belongs to user
      const existingCategory = await db.query.categories.findFirst({
        where: and(eq(categories.id, input.id), eq(categories.userId, userId)),
      });

      if (!existingCategory) {
        throw new ORPCError("NOT_FOUND", { message: "Category not found" });
      }

      await db.delete(categories).where(eq(categories.id, input.id));

      return { success: true, id: input.id };
    }),
};

export type Category = InferRouterOutputs<
  typeof categoriesRouter
>["list"][number];
