import { protectedProcedure } from "@/orpc";
import { db, links, linkCategories, linkTags } from "@/db";
import { InferRouterOutputs, ORPCError } from "@orpc/server";
import { eq, and, ilike, or, inArray, count, desc, asc } from "drizzle-orm";
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

      // Create link
      const [link] = await db
        .insert(links)
        .values({
          ...linkData,
          userId,
        })
        .returning();

      // Create category relations
      if (categoryIds && categoryIds.length > 0) {
        await db.insert(linkCategories).values(
          categoryIds.map((categoryId) => ({
            linkId: link.id,
            categoryId,
          }))
        );
      }

      // Create tag relations
      if (tagIds && tagIds.length > 0) {
        await db.insert(linkTags).values(
          tagIds.map((tagId) => ({
            linkId: link.id,
            tagId,
          }))
        );
      }

      // Fetch the complete link with relations
      const result = await db.query.links.findFirst({
        where: eq(links.id, link.id),
        with: {
          linkCategories: {
            with: {
              category: true,
            },
          },
          linkTags: {
            with: {
              tag: true,
            },
          },
        },
      });

      return result!;
    }),

  // Get all links with filters
  list: protectedProcedure
    .input(getLinksSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const {
        search,
        categoryIds,
        tagIds,
        isFavorite,
        limit,
        offset,
        sortBy,
        sortOrder,
      } = input;

      // Build where conditions
      const conditions = [eq(links.userId, userId)];

      if (search) {
        conditions.push(
          or(
            ilike(links.title, `%${search}%`),
            ilike(links.description, `%${search}%`),
            ilike(links.notes, `%${search}%`),
            ilike(links.url, `%${search}%`)
          )!
        );
      }

      if (isFavorite !== undefined) {
        conditions.push(eq(links.isFavorite, isFavorite));
      }

      // Get total count
      const [{ count: total }] = await db
        .select({ count: count() })
        .from(links)
        .where(and(...conditions));

      // Build order by
      const orderByColumn = links[sortBy as keyof typeof links.$inferSelect];
      const orderBy =
        sortOrder === "desc" ? desc(orderByColumn) : asc(orderByColumn);

      // Get links with relations
      let linkResults = await db.query.links.findMany({
        where: and(...conditions),
        with: {
          linkCategories: {
            with: {
              category: true,
            },
          },
          linkTags: {
            with: {
              tag: true,
            },
          },
        },
        orderBy,
        limit,
        offset,
      });

      // Filter by category and tag IDs if provided
      if (categoryIds && categoryIds.length > 0) {
        linkResults = linkResults.filter((link) =>
          link.linkCategories.some((lc) => categoryIds.includes(lc.categoryId))
        );
      }

      if (tagIds && tagIds.length > 0) {
        linkResults = linkResults.filter((link) =>
          link.linkTags.some((lt) => tagIds.includes(lt.tagId))
        );
      }

      return {
        links: linkResults,
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

      const link = await db.query.links.findFirst({
        where: and(eq(links.id, input.id), eq(links.userId, userId)),
        with: {
          linkCategories: {
            with: {
              category: true,
            },
          },
          linkTags: {
            with: {
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
      const existingLink = await db.query.links.findFirst({
        where: and(eq(links.id, id), eq(links.userId, userId)),
      });

      if (!existingLink) {
        throw new ORPCError("NOT_FOUND", { message: "Link not found" });
      }

      // Update link
      await db.update(links).set(updateData).where(eq(links.id, id));

      // Update category relations if provided
      if (categoryIds !== undefined) {
        await db.delete(linkCategories).where(eq(linkCategories.linkId, id));
        if (categoryIds.length > 0) {
          await db.insert(linkCategories).values(
            categoryIds.map((categoryId) => ({
              linkId: id,
              categoryId,
            }))
          );
        }
      }

      // Update tag relations if provided
      if (tagIds !== undefined) {
        await db.delete(linkTags).where(eq(linkTags.linkId, id));
        if (tagIds.length > 0) {
          await db.insert(linkTags).values(
            tagIds.map((tagId) => ({
              linkId: id,
              tagId,
            }))
          );
        }
      }

      // Fetch updated link with relations
      const link = await db.query.links.findFirst({
        where: eq(links.id, id),
        with: {
          linkCategories: {
            with: {
              category: true,
            },
          },
          linkTags: {
            with: {
              tag: true,
            },
          },
        },
      });

      return link!;
    }),

  // Toggle favorite
  toggleFavorite: protectedProcedure
    .input(toggleFavoriteSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      // Check if link exists and belongs to user
      const existingLink = await db.query.links.findFirst({
        where: and(eq(links.id, input.id), eq(links.userId, userId)),
      });

      if (!existingLink) {
        throw new ORPCError("NOT_FOUND", { message: "Link not found" });
      }

      await db
        .update(links)
        .set({ isFavorite: input.isFavorite })
        .where(eq(links.id, input.id));

      const link = await db.query.links.findFirst({
        where: eq(links.id, input.id),
        with: {
          linkCategories: {
            with: {
              category: true,
            },
          },
          linkTags: {
            with: {
              tag: true,
            },
          },
        },
      });

      return link!;
    }),

  // Delete link
  delete: protectedProcedure
    .input(deleteLinkSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      // Check if link exists and belongs to user
      const existingLink = await db.query.links.findFirst({
        where: and(eq(links.id, input.id), eq(links.userId, userId)),
      });

      if (!existingLink) {
        throw new ORPCError("NOT_FOUND", { message: "Link not found" });
      }

      await db.delete(links).where(eq(links.id, input.id));

      return { success: true, id: input.id };
    }),

  // Bulk delete links
  bulkDelete: protectedProcedure
    .input(bulkDeleteLinksSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      // Delete only links that belong to the user
      const result = await db
        .delete(links)
        .where(and(inArray(links.id, input.ids), eq(links.userId, userId)));

      return { success: true, deletedCount: result.rowCount ?? 0 };
    }),
};

export type Link = InferRouterOutputs<
  typeof linksRouter
>["list"]["links"][number];
