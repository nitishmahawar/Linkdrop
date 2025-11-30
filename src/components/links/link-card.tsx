import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LinkActionsMenu } from "./link-actions-menu";

interface LinkCardProps {
  link: any; // TODO: Type this properly from ORPC
}

export const LinkCard = ({ link }: LinkCardProps) => {
  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {link.faviconUrl && (
              <img
                src={link.faviconUrl}
                alt=""
                className="w-5 h-5 mt-0.5 shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base line-clamp-2 mb-1">
                {link.title}
              </h3>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-primary truncate block"
              >
                {new URL(link.url).hostname}
              </a>
            </div>
          </div>

          <LinkActionsMenu link={link} />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {link.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {link.description}
          </p>
        )}

        {link.previewImageUrl && (
          <img
            src={link.previewImageUrl}
            alt={link.title}
            className="w-full h-32 object-cover rounded-md mb-3"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}

        {link.linkCategories && link.linkCategories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {link.linkCategories.map((lc: any) => (
              <Badge
                key={lc.categoryId}
                variant="secondary"
                className="text-xs"
              >
                {lc.category.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
