import { protectedProcedure } from "@/orpc";
import { db, links, categories, tags } from "@/db";
import { eq, count, and, desc, asc } from "drizzle-orm";
import { exportDataSchema, getAccountStatsSchema } from "./schema";

// Export the user router
export const userRouter = {
  // Export all user data
  exportData: protectedProcedure
    .input(exportDataSchema)
    .handler(async ({ context }) => {
      const userId = context.session.user.id;

      // Fetch all user data in parallel
      const [userLinks, userCategories, userTags] = await Promise.all([
        db.query.links.findMany({
          where: eq(links.userId, userId),
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
          orderBy: desc(links.createdAt),
        }),
        db.query.categories.findMany({
          where: eq(categories.userId, userId),
          orderBy: asc(categories.name),
        }),
        db.query.tags.findMany({
          where: eq(tags.userId, userId),
          orderBy: asc(tags.name),
        }),
      ]);

      return {
        links: userLinks,
        categories: userCategories,
        tags: userTags,
        exportedAt: new Date().toISOString(),
      };
    }),

  // Get account statistics
  getAccountStats: protectedProcedure
    .input(getAccountStatsSchema)
    .handler(async ({ context }) => {
      const userId = context.session.user.id;

      // Get counts in parallel
      const [
        [{ count: totalLinks }],
        [{ count: totalCategories }],
        [{ count: totalTags }],
        [{ count: favoriteLinks }],
      ] = await Promise.all([
        db
          .select({ count: count() })
          .from(links)
          .where(eq(links.userId, userId)),
        db
          .select({ count: count() })
          .from(categories)
          .where(eq(categories.userId, userId)),
        db.select({ count: count() }).from(tags).where(eq(tags.userId, userId)),
        db
          .select({ count: count() })
          .from(links)
          .where(and(eq(links.userId, userId), eq(links.isFavorite, true))),
      ]);

      return {
        totalLinks,
        totalCategories,
        totalTags,
        favoriteLinks,
      };
    }),
};
