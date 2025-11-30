import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { CreateLinkDialog } from "./create-link-dialog";
import { Link as LinkIcon } from "lucide-react";

interface EmptyLinksProps {
  hasSearch?: boolean;
}

export const EmptyLinks = ({ hasSearch = false }: EmptyLinksProps) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LinkIcon />
        </EmptyMedia>
        <EmptyTitle>{hasSearch ? "No links found" : "No links yet"}</EmptyTitle>
        <EmptyDescription>
          {hasSearch
            ? "Try adjusting your search terms or filters"
            : "Start building your link collection by adding your first link"}
        </EmptyDescription>
      </EmptyHeader>
      {!hasSearch && (
        <EmptyContent>
          <CreateLinkDialog />
        </EmptyContent>
      )}
    </Empty>
  );
};
