import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/orpc/client";
import {
  MultiSelect,
  MultiSelectTrigger,
  MultiSelectValue,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectGroup,
} from "@/components/ui/multi-select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag } from "lucide-react";

interface TagFilterProps {
  selectedTagIds: string[];
  onTagChange: (tagIds: string[]) => void;
}

export const TagFilter = ({ selectedTagIds, onTagChange }: TagFilterProps) => {
  const tagsQuery = useQuery(
    orpc.tags.list.queryOptions({
      input: {},
    })
  );

  const tags = tagsQuery.data ?? [];

  return (
    <MultiSelect
      values={selectedTagIds}
      onValuesChange={onTagChange}
      modal={false}
    >
      <MultiSelectTrigger className="gap-2">
        <Tag className="h-4 w-4" />
        <MultiSelectValue
          placeholder="Tags"
          clickToRemove={false}
          overflowBehavior="cutoff"
          className="max-w-[120px]"
        />
      </MultiSelectTrigger>
      <MultiSelectContent
        search={{
          placeholder: "Search tags...",
          emptyMessage: "No tags found",
        }}
      >
        <MultiSelectGroup>
          {tagsQuery.isLoading && (
            <div className="p-2 space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          )}
          {tagsQuery.isError && (
            <div className="px-2 py-4 text-center text-sm text-destructive">
              Failed to load tags
            </div>
          )}
          {tags.map((tag) => (
            <MultiSelectItem
              key={tag.id}
              value={tag.id}
              badgeLabel={`#${tag.name}`}
            >
              #{tag.name}
            </MultiSelectItem>
          ))}
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  );
};
