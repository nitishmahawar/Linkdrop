import { protectedProcedure } from "@/orpc";
import { prisma } from "@/lib/prisma";
import { ORPCError } from "@orpc/server";
import {
  createLinkSchema,
  updateLinkSchema,
  getLinkByIdSchema,
  deleteLinkSchema,
  getLinksSchema,
  toggleFavoriteSchema,
  bulkDeleteLinksSchema,
} from "./schema";

// Export the links router
export const linksRouter = {
  // Create a new link
  create: protectedProcedure
    .input(createLinkSchema)
    .handler(async ({ input, context }) => {
      const { categoryIds, tagIds, ...linkData } = input;
      const userId = context.session.user.id;

      // Create link with relations
      const link = await prisma.link.create({
        data: {
          ...linkData,
          userId,
          linkCategories: categoryIds
            ? {
                create: categoryIds.map((categoryId: string) => ({
                  categoryId,
                })),
              }
            : undefined,
          linkTags: tagIds
            ? {
                create: tagIds.map((tagId: string) => ({
                  tagId,
                })),
              }
            : undefined,
        },
        include: {
          linkCategories: {
            include: {
              category: true,
            },
          },
          linkTags: {
            include: {
              tag: true,
            },
          },
        },
      });

      return link;
    }),

  // Get all links with filters
  list: protectedProcedure
    .input(getLinksSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const {
        search,
        categoryId,
        tagId,
        isFavorite,
        limit,
        offset,
        sortBy,
        sortOrder,
      } = input;

      // Get total count
      const total = await prisma.link.count({
        where: {
          userId,
          ...(search && {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              { notes: { contains: search, mode: "insensitive" } },
              { url: { contains: search, mode: "insensitive" } },
            ],
          }),
          ...(categoryId && {
            linkCategories: {
              some: {
                categoryId,
              },
            },
          }),
          ...(tagId && {
            linkTags: {
              some: {
                tagId,
              },
            },
          }),
          ...(isFavorite !== undefined && { isFavorite }),
        },
      });

      // Get links
      const links = await prisma.link.findMany({
        where: {
          userId,
          ...(search && {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              { notes: { contains: search, mode: "insensitive" } },
              { url: { contains: search, mode: "insensitive" } },
            ],
          }),
          ...(categoryId && {
            linkCategories: {
              some: {
                categoryId,
              },
            },
          }),
          ...(tagId && {
            linkTags: {
              some: {
                tagId,
              },
            },
          }),
          ...(isFavorite !== undefined && { isFavorite }),
        },
        include: {
          linkCategories: {
            include: {
              category: true,
            },
          },
          linkTags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        take: limit,
        skip: offset,
      });

      return {
        links,
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      };
    }),

  // Get link by ID
  get: protectedProcedure
    .input(getLinkByIdSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      const link = await prisma.link.findFirst({
        where: {
          id: input.id,
          userId,
        },
        include: {
          linkCategories: {
            include: {
              category: true,
            },
          },
          linkTags: {
            include: {
              tag: true,
            },
          },
        },
      });

      if (!link) {
        throw new ORPCError("NOT_FOUND", { message: "Link not found" });
      }

      return link;
    }),

  // Update link
  update: protectedProcedure
    .input(updateLinkSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const { id, categoryIds, tagIds, ...updateData } = input;

      // Check if link exists and belongs to user
      const existingLink = await prisma.link.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!existingLink) {
        throw new ORPCError("NOT_FOUND", { message: "Link not found" });
      }

      // Update link
      const link = await prisma.link.update({
        where: { id },
        data: {
          ...updateData,
          ...(categoryIds !== undefined && {
            linkCategories: {
              deleteMany: {},
              create: categoryIds.map((categoryId: string) => ({
                categoryId,
              })),
            },
          }),
          ...(tagIds !== undefined && {
            linkTags: {
              deleteMany: {},
              create: tagIds.map((tagId: string) => ({
                tagId,
              })),
            },
          }),
        },
        include: {
          linkCategories: {
            include: {
              category: true,
            },
          },
          linkTags: {
            include: {
              tag: true,
            },
          },
        },
      });

      return link;
    }),

  // Toggle favorite
  toggleFavorite: protectedProcedure
    .input(toggleFavoriteSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      // Check if link exists and belongs to user
      const existingLink = await prisma.link.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!existingLink) {
        throw new ORPCError("NOT_FOUND", { message: "Link not found" });
      }

      const link = await prisma.link.update({
        where: { id: input.id },
        data: { isFavorite: input.isFavorite },
        include: {
          linkCategories: {
            include: {
              category: true,
            },
          },
          linkTags: {
            include: {
              tag: true,
            },
          },
        },
      });

      return link;
    }),

  // Delete link
  delete: protectedProcedure
    .input(deleteLinkSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      // Check if link exists and belongs to user
      const existingLink = await prisma.link.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!existingLink) {
        throw new ORPCError("NOT_FOUND", { message: "Link not found" });
      }

      await prisma.link.delete({
        where: { id: input.id },
      });

      return { success: true, id: input.id };
    }),

  // Bulk delete links
  bulkDelete: protectedProcedure
    .input(bulkDeleteLinksSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      // Delete only links that belong to the user
      const result = await prisma.link.deleteMany({
        where: {
          id: { in: input.ids },
          userId,
        },
      });

      return { success: true, deletedCount: result.count };
    }),
};
