import { pgTable, text, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { users } from "./users";
import { linkCategories } from "./link-categories";
import { linkTags } from "./link-tags";

export const links = pgTable(
  "links",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    notes: text("notes"),
    faviconUrl: text("faviconUrl"),
    previewImageUrl: text("previewImageUrl"),
    isFavorite: boolean("isFavorite").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("links_userId_idx").on(table.userId),
    index("links_isFavorite_idx").on(table.isFavorite),
  ]
);

export const linksRelations = relations(links, ({ one, many }) => ({
  user: one(users, {
    fields: [links.userId],
    references: [users.id],
  }),
  linkCategories: many(linkCategories),
  linkTags: many(linkTags),
}));
