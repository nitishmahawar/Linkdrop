import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";
import { LinkActionsMenu } from "./link-actions-menu";
import { ExternalLink, Globe } from "lucide-react";
import type { Link } from "@/orpc/router/links";

interface LinkListItemProps {
  link: Link;
}

export const LinkListItem = ({ link }: LinkListItemProps) => {
  const handleItemClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on action buttons or badges
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest("[data-badge]")
    ) {
      return;
    }
    window.open(link.url, "_blank", "noopener,noreferrer");
  };

  return (
    <Item
      variant="muted"
      className="group border border-border hover:ring-2 hover:ring-primary/20 cursor-pointer transition-all"
      onClick={handleItemClick}
    >
      {/* Favicon with fallback */}
      <ItemMedia variant="image">
        {link.faviconUrl ? (
          <img
            src={link.faviconUrl}
            alt=""
            className="w-6 h-6"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const icon = document.createElement("div");
                icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`;
                parent.appendChild(icon.firstChild!);
              }
            }}
          />
        ) : (
          <Globe className="w-5 h-5 text-muted-foreground" />
        )}
      </ItemMedia>

      <ItemContent>
        <div className="space-y-1">
          {/* Title */}
          <ItemTitle className="group-hover:text-primary transition-colors">
            {link.title}
          </ItemTitle>

          {/* Description */}
          {link.description && (
            <ItemDescription className="line-clamp-2">
              {link.description}
            </ItemDescription>
          )}

          {/* URL with icon */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ExternalLink className="w-3 h-3 shrink-0" />
            <span className="truncate hover:text-primary transition-colors">
              {new URL(link.url).hostname}
            </span>
          </div>

          {/* Notes (if available) */}
          {link.notes && (
            <div className="text-xs text-muted-foreground/80 italic border-l-2 border-muted pl-2 py-0.5 mt-2">
              <p className="line-clamp-1">{link.notes}</p>
            </div>
          )}
        </div>
      </ItemContent>

      <ItemActions>
        {/* Categories and Tags */}
        <div className="flex flex-wrap gap-1.5">
          {link.linkCategories && link.linkCategories.length > 0 && (
            <>
              {link.linkCategories.slice(0, 2).map((lc: any) => (
                <Badge
                  key={lc.categoryId}
                  variant="secondary"
                  className="text-xs font-medium hover:bg-secondary/80 transition-colors"
                  data-badge
                  onClick={(e) => e.stopPropagation()}
                >
                  {lc.category.name}
                </Badge>
              ))}
              {link.linkCategories.length > 2 && (
                <Badge
                  variant="secondary"
                  className="text-xs font-medium"
                  data-badge
                >
                  +{link.linkCategories.length - 2}
                </Badge>
              )}
            </>
          )}

          {link.linkTags && link.linkTags.length > 0 && (
            <>
              {link.linkTags.slice(0, 2).map((lt: any) => (
                <Badge
                  key={lt.tagId}
                  variant="outline"
                  className="text-xs font-medium hover:bg-accent transition-colors"
                  data-badge
                  onClick={(e) => e.stopPropagation()}
                >
                  #{lt.tag.name}
                </Badge>
              ))}
              {link.linkTags.length > 2 && (
                <Badge
                  variant="outline"
                  className="text-xs font-medium"
                  data-badge
                >
                  +{link.linkTags.length - 2}
                </Badge>
              )}
            </>
          )}
        </div>

        {/* Actions Menu - prevent item click */}
        <div onClick={(e) => e.stopPropagation()}>
          <LinkActionsMenu link={link} />
        </div>
      </ItemActions>
    </Item>
  );
};
