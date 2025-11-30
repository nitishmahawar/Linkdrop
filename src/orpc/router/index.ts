import { linksRouter } from "./links";
import { categoriesRouter } from "./cateogories";
import { tagsRouter } from "./tags";
import { metadataRouter } from "./metadata";

export const router = {
  links: linksRouter,
  categories: categoriesRouter,
  tags: tagsRouter,
  metadata: metadataRouter,
};
