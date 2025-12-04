import { protectedProcedure } from "@/orpc";
import { prisma } from "@/lib/prisma";
import { exportDataSchema, getAccountStatsSchema } from "./schema";

// Export the user router
export const userRouter = {
  // Export all user data
  exportData: protectedProcedure
    .input(exportDataSchema)
    .handler(async ({ context }) => {
      const userId = context.session.user.id;

      // Fetch all user data in parallel
      const [links, categories, tags] = await Promise.all([
        prisma.link.findMany({
          where: { userId },
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
            createdAt: "desc",
          },
        }),
        prisma.category.findMany({
          where: { userId },
          orderBy: {
            name: "asc",
          },
        }),
        prisma.tag.findMany({
          where: { userId },
          orderBy: {
            name: "asc",
          },
        }),
      ]);

      return {
        links,
        categories,
        tags,
        exportedAt: new Date().toISOString(),
      };
    }),

  // Get account statistics
  getAccountStats: protectedProcedure
    .input(getAccountStatsSchema)
    .handler(async ({ context }) => {
      const userId = context.session.user.id;

      // Get counts in parallel
      const [totalLinks, totalCategories, totalTags, favoriteLinks] =
        await Promise.all([
          prisma.link.count({
            where: { userId },
          }),
          prisma.category.count({
            where: { userId },
          }),
          prisma.tag.count({
            where: { userId },
          }),
          prisma.link.count({
            where: {
              userId,
              isFavorite: true,
            },
          }),
        ]);

      return {
        totalLinks,
        totalCategories,
        totalTags,
        favoriteLinks,
      };
    }),
};
