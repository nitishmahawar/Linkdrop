import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LinkActionsMenu } from "./link-actions-menu";
import { ExternalLink, Globe } from "lucide-react";
import type { Link } from "@/orpc/router/links";

interface LinkCardProps {
  link: Link;
}

export const LinkCard = ({ link }: LinkCardProps) => {
  const handleCardClick = (e: React.MouseEvent) => {
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
    <Card
      className="group relative hover:ring-2 hover:ring-primary/20 overflow-hidden cursor-pointer pt-0"
      onClick={handleCardClick}
    >
      {/* Preview Image or Gradient Placeholder */}
      <div className="relative h-48 overflow-hidden bg-linear-to-br from-primary/10 via-primary/5 to-background">
        {link.previewImageUrl ? (
          <>
            <img
              src={link.previewImageUrl}
              alt={link.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-8xl font-bold text-primary/10 select-none">
              {link.title.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>

      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Favicon with fallback */}
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 border">
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
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              {/* Title */}
              <h3 className="font-semibold text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                {link.title}
              </h3>

              {/* URL with icon */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ExternalLink className="w-3 h-3 shrink-0" />
                <span className="truncate hover:text-primary transition-colors">
                  {new URL(link.url).hostname}
                </span>
              </div>
            </div>
          </div>

          {/* Actions Menu - prevent card click */}
          <div onClick={(e) => e.stopPropagation()}>
            <LinkActionsMenu link={link} />
          </div>
        </div>

        {/* Description */}
        {link.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {link.description}
          </p>
        )}

        {/* Notes (if available) */}
        {link.notes && (
          <div className="text-xs text-muted-foreground/80 italic border-l-2 border-muted pl-3 py-1">
            <p className="line-clamp-2">{link.notes}</p>
          </div>
        )}

        {/* Categories and Tags */}
        <div className="flex flex-wrap gap-1.5">
          {link.linkCategories && link.linkCategories.length > 0 && (
            <>
              {link.linkCategories.map((lc: any) => (
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
            </>
          )}

          {link.linkTags && link.linkTags.length > 0 && (
            <>
              {link.linkTags.map((lt: any) => (
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
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
