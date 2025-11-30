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

interface LinkListItemProps {
  link: any; // TODO: Type this properly from ORPC
}

export const LinkListItem = ({ link }: LinkListItemProps) => {
  return (
    <Item variant="outline">
      <ItemMedia variant="image">
        {link.faviconUrl ? (
          <img
            src={link.faviconUrl}
            alt=""
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
      </ItemMedia>

      <ItemContent>
        <ItemTitle>{link.title}</ItemTitle>
        {link.description && (
          <ItemDescription>{link.description}</ItemDescription>
        )}
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-primary truncate block"
        >
          {link.url}
        </a>
      </ItemContent>

      <ItemActions>
        {link.linkCategories && link.linkCategories.length > 0 && (
          <div className="flex gap-1">
            {link.linkCategories.slice(0, 2).map((lc: any) => (
              <Badge
                key={lc.categoryId}
                variant="secondary"
                className="text-xs"
              >
                {lc.category.name}
              </Badge>
            ))}
            {link.linkCategories.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{link.linkCategories.length - 2}
              </Badge>
            )}
          </div>
        )}

        <LinkActionsMenu link={link} />
      </ItemActions>
    </Item>
  );
};
