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
import { Filter } from "lucide-react";

interface CategoryFilterProps {
  selectedCategoryIds: string[];
  onCategoryChange: (categoryIds: string[]) => void;
}

export const CategoryFilter = ({
  selectedCategoryIds,
  onCategoryChange,
}: CategoryFilterProps) => {
  const categoriesQuery = useQuery(
    orpc.categories.list.queryOptions({
      input: {},
    })
  );

  const categories = categoriesQuery.data ?? [];

  return (
    <MultiSelect
      values={selectedCategoryIds}
      onValuesChange={onCategoryChange}
      modal={false}
    >
      <MultiSelectTrigger className="gap-2">
        <Filter className="h-4 w-4" />
        <MultiSelectValue
          placeholder="Categories"
          clickToRemove={false}
          overflowBehavior="cutoff"
          className="max-w-[120px]"
        />
      </MultiSelectTrigger>
      <MultiSelectContent
        search={{
          placeholder: "Search categories...",
          emptyMessage: "No categories found",
        }}
      >
        <MultiSelectGroup>
          {categoriesQuery.isLoading && (
            <div className="p-2 space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          )}
          {categoriesQuery.isError && (
            <div className="px-2 py-4 text-center text-sm text-destructive">
              Failed to load categories
            </div>
          )}
          {categories.map((category) => (
            <MultiSelectItem
              key={category.id}
              value={category.id}
              badgeLabel={
                <div className="flex items-center gap-1.5">
                  {category.color && (
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                  )}
                  <span>{category.name}</span>
                </div>
              }
            >
              <div className="flex items-center gap-2">
                {category.color && (
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                )}
                <span>{category.name}</span>
              </div>
            </MultiSelectItem>
          ))}
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  );
};
