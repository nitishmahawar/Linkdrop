import { protectedProcedure } from "@/orpc";
import { db, tags } from "@/db";
import { InferRouterOutputs, ORPCError } from "@orpc/server";
import { eq, and, ilike, desc } from "drizzle-orm";
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

      const [tag] = await db
        .insert(tags)
        .values({
          ...input,
          userId,
        })
        .returning();

      // Fetch with relations
      const result = await db.query.tags.findFirst({
        where: eq(tags.id, tag.id),
        with: {
          linkTags: {
            with: {
              link: true,
            },
          },
        },
      });

      return result!;
    }),

  // Get all tags
  list: protectedProcedure
    .input(getTagsSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const { search } = input;

      const conditions = [eq(tags.userId, userId)];

      if (search) {
        conditions.push(ilike(tags.name, `%${search}%`));
      }

      const result = await db.query.tags.findMany({
        where: and(...conditions),
        orderBy: desc(tags.createdAt),
      });

      return result;
    }),

  // Get tag by ID
  get: protectedProcedure
    .input(getTagByIdSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      const tag = await db.query.tags.findFirst({
        where: and(eq(tags.id, input.id), eq(tags.userId, userId)),
        with: {
          linkTags: {
            with: {
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
      const existingTag = await db.query.tags.findFirst({
        where: and(eq(tags.id, id), eq(tags.userId, userId)),
      });

      if (!existingTag) {
        throw new ORPCError("NOT_FOUND", { message: "Tag not found" });
      }

      await db.update(tags).set(updateData).where(eq(tags.id, id));

      const tag = await db.query.tags.findFirst({
        where: eq(tags.id, id),
        with: {
          linkTags: {
            with: {
              link: true,
            },
          },
        },
      });

      return tag!;
    }),

  // Delete tag
  delete: protectedProcedure
    .input(deleteTagSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      // Check if tag exists and belongs to user
      const existingTag = await db.query.tags.findFirst({
        where: and(eq(tags.id, input.id), eq(tags.userId, userId)),
      });

      if (!existingTag) {
        throw new ORPCError("NOT_FOUND", { message: "Tag not found" });
      }

      await db.delete(tags).where(eq(tags.id, input.id));

      return { success: true, id: input.id };
    }),
};

export type Tag = InferRouterOutputs<typeof tagsRouter>["list"][number];
