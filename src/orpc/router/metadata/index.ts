import { protectedProcedure } from "@/orpc";
import { ORPCError } from "@orpc/server";
import { fetchMetadataSchema } from "./schema";
import * as cheerio from "cheerio";

// Helper function to extract metadata from HTML using Cheerio
const extractMetadata = (html: string, url: string) => {
  const $ = cheerio.load(html);

  const metadata: {
    title?: string;
    description?: string;
    faviconUrl?: string;
    previewImageUrl?: string;
  } = {};

  // Extract title - try multiple sources
  metadata.title =
    $('meta[property="og:title"]').attr("content") ||
    $('meta[name="twitter:title"]').attr("content") ||
    $("title").text() ||
    undefined;

  // Clean up title
  if (metadata.title) {
    metadata.title = metadata.title.trim();
  }

  // Extract description - try multiple sources
  metadata.description =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="twitter:description"]').attr("content") ||
    $('meta[name="description"]').attr("content") ||
    undefined;

  // Clean up description
  if (metadata.description) {
    metadata.description = metadata.description.trim();
  }

  // Extract favicon
  let faviconUrl =
    $('link[rel="icon"]').attr("href") ||
    $('link[rel="shortcut icon"]').attr("href") ||
    $('link[rel="apple-touch-icon"]').attr("href");

  if (faviconUrl) {
    // Convert relative URL to absolute
    try {
      metadata.faviconUrl = faviconUrl.startsWith("http")
        ? faviconUrl
        : new URL(faviconUrl, url).toString();
    } catch (e) {
      // Invalid URL, skip
    }
  }

  // Fallback to default favicon
  if (!metadata.faviconUrl) {
    try {
      const urlObj = new URL(url);
      metadata.faviconUrl = `${urlObj.origin}/favicon.ico`;
    } catch (e) {
      // Invalid URL, skip favicon
    }
  }

  // Extract preview image - try multiple sources
  let previewImageUrl =
    $('meta[property="og:image"]').attr("content") ||
    $('meta[property="og:image:url"]').attr("content") ||
    $('meta[name="twitter:image"]').attr("content") ||
    $('meta[name="twitter:image:src"]').attr("content");

  if (previewImageUrl) {
    // Convert relative URL to absolute
    try {
      metadata.previewImageUrl = previewImageUrl.startsWith("http")
        ? previewImageUrl
        : new URL(previewImageUrl, url).toString();
    } catch (e) {
      // Invalid URL, skip
    }
  }

  return metadata;
};

// Export the metadata router
export const metadataRouter = {
  // Fetch metadata from URL
  fetch: protectedProcedure
    .input(fetchMetadataSchema)
    .handler(async ({ input }) => {
      const { url } = input;

      try {
        // Fetch the URL
        const response = await fetch(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
          redirect: "follow",
        });

        if (!response.ok) {
          throw new ORPCError("BAD_REQUEST", {
            message: `Failed to fetch URL: ${response.status} ${response.statusText}`,
          });
        }

        const html = await response.text();
        const metadata = extractMetadata(html, url);

        return {
          ...metadata,
          url,
        };
      } catch (error) {
        if (error instanceof ORPCError) {
          throw error;
        }

        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message:
            error instanceof Error
              ? `Failed to fetch metadata: ${error.message}`
              : "Failed to fetch metadata",
        });
      }
    }),
};
