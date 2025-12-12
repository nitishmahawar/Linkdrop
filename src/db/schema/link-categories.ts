import { pgTable, text, index, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { links } from "./links";
import { categories } from "./categories";

export const linkCategories = pgTable(
  "link_categories",
  {
    linkId: text("linkId")
      .notNull()
      .references(() => links.id, { onDelete: "cascade" }),
    categoryId: text("categoryId")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.linkId, table.categoryId] }),
    index("link_categories_linkId_idx").on(table.linkId),
    index("link_categories_categoryId_idx").on(table.categoryId),
  ]
);

export const linkCategoriesRelations = relations(linkCategories, ({ one }) => ({
  link: one(links, {
    fields: [linkCategories.linkId],
    references: [links.id],
  }),
  category: one(categories, {
    fields: [linkCategories.categoryId],
    references: [categories.id],
  }),
}));
