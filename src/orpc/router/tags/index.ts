import { protectedProcedure } from "@/orpc";
import { prisma } from "@/lib/prisma";
import { InferRouterOutputs, ORPCError } from "@orpc/server";
import {
  createTagSchema,
  updateTagSchema,
  getTagByIdSchema,
  deleteTagSchema,
  getTagsSchema,
} from "./schema";

// Export the tags router
export const tagsRouter = {
  // Create a new tag
  create: protectedProcedure
    .input(createTagSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      const tag = await prisma.tag.create({
        data: {
          ...input,
          userId,
        },
        include: {
          linkTags: {
            include: {
              link: true,
            },
          },
        },
      });

      return tag;
    }),

  // Get all tags
  list: protectedProcedure
    .input(getTagsSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const { search } = input;

      const tags = await prisma.tag.findMany({
        where: {
          userId,
          ...(search && {
            name: { contains: search, mode: "insensitive" },
          }),
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return tags;
    }),

  // Get tag by ID
  get: protectedProcedure
    .input(getTagByIdSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      const tag = await prisma.tag.findFirst({
        where: {
          id: input.id,
          userId,
        },
        include: {
          linkTags: {
            include: {
              link: true,
            },
          },
        },
      });

      if (!tag) {
        throw new ORPCError("NOT_FOUND", { message: "Tag not found" });
      }

      return tag;
    }),

  // Update tag
  update: protectedProcedure
    .input(updateTagSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const { id, ...updateData } = input;

      // Check if tag exists and belongs to user
      const existingTag = await prisma.tag.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!existingTag) {
        throw new ORPCError("NOT_FOUND", { message: "Tag not found" });
      }

      const tag = await prisma.tag.update({
        where: { id },
        data: updateData,
        include: {
          linkTags: {
            include: {
              link: true,
            },
          },
        },
      });

      return tag;
    }),

  // Delete tag
  delete: protectedProcedure
    .input(deleteTagSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      // Check if tag exists and belongs to user
      const existingTag = await prisma.tag.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!existingTag) {
        throw new ORPCError("NOT_FOUND", { message: "Tag not found" });
      }

      await prisma.tag.delete({
        where: { id: input.id },
      });

      return { success: true, id: input.id };
    }),
};

export type Tag = InferRouterOutputs<typeof tagsRouter>["list"][number];
