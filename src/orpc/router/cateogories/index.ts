import { protectedProcedure } from "@/orpc";
import { prisma } from "@/lib/prisma";
import { ORPCError } from "@orpc/server";
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

      const category = await prisma.category.create({
        data: {
          ...input,
          userId,
        },
        include: {
          linkCategories: {
            include: {
              link: true,
            },
          },
        },
      });

      return category;
    }),

  // Get all categories
  list: protectedProcedure
    .input(getCategoriesSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const { search } = input;

      const categories = await prisma.category.findMany({
        where: {
          userId,
          ...(search && {
            name: { contains: search, mode: "insensitive" },
          }),
        },
        include: {
          linkCategories: {
            include: {
              link: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return categories;
    }),

  // Get category by ID
  get: protectedProcedure
    .input(getCategoryByIdSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      const category = await prisma.category.findFirst({
        where: {
          id: input.id,
          userId,
        },
        include: {
          linkCategories: {
            include: {
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
      const existingCategory = await prisma.category.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!existingCategory) {
        throw new ORPCError("NOT_FOUND", { message: "Category not found" });
      }

      const category = await prisma.category.update({
        where: { id },
        data: updateData,
        include: {
          linkCategories: {
            include: {
              link: true,
            },
          },
        },
      });

      return category;
    }),

  // Delete category
  delete: protectedProcedure
    .input(deleteCategorySchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      // Check if category exists and belongs to user
      const existingCategory = await prisma.category.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!existingCategory) {
        throw new ORPCError("NOT_FOUND", { message: "Category not found" });
      }

      await prisma.category.delete({
        where: { id: input.id },
      });

      return { success: true, id: input.id };
    }),
};
