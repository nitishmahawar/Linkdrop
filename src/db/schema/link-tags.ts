import { pgTable, text, index, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { links } from "./links";
import { tags } from "./tags";

export const linkTags = pgTable(
  "link_tags",
  {
    linkId: text("linkId")
      .notNull()
      .references(() => links.id, { onDelete: "cascade" }),
    tagId: text("tagId")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.linkId, table.tagId] }),
    index("link_tags_linkId_idx").on(table.linkId),
    index("link_tags_tagId_idx").on(table.tagId),
  ]
);

export const linkTagsRelations = relations(linkTags, ({ one }) => ({
  link: one(links, {
    fields: [linkTags.linkId],
    references: [links.id],
  }),
  tag: one(tags, {
    fields: [linkTags.tagId],
    references: [tags.id],
  }),
}));
