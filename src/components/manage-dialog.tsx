import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/orpc/client";
import { Badge } from "@/components/ui/badge";
import { Settings2, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { CreateCategoryDialog } from "@/components/categories/create-category-dialog";
import { CreateTagDialog } from "@/components/tags/create-tag-dialog";
import { EditCategoryDialog } from "@/components/categories/edit-category-dialog";
import { EditTagDialog } from "@/components/tags/edit-tag-dialog";
import { DeleteCategoryDialog } from "@/components/categories/delete-category-dialog";
import { DeleteTagDialog } from "@/components/tags/delete-tag-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/components/ui/empty";
import type { Category } from "@/orpc/router/cateogories";
import type { Tag } from "@/orpc/router/tags";

export const ManageDialog = () => {
  const [open, setOpen] = useState(false);
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);
  const [createTagOpen, setCreateTagOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );
  const [deletingTag, setDeletingTag] = useState<Tag | null>(null);

  // Fetch categories
  const categoriesQuery = useQuery(
    orpc.categories.list.queryOptions({
      input: {},
    })
  );

  // Fetch tags
  const tagsQuery = useQuery(
    orpc.tags.list.queryOptions({
      input: {},
    })
  );

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Settings2 className="h-4 w-4" />
            Manage
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Manage Categories & Tags</DialogTitle>
            <DialogDescription>
              Create, edit, and delete your categories and tags
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="categories" className="flex-1 overflow-hidden">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="tags">Tags</TabsTrigger>
            </TabsList>

            {/* Categories Tab */}
            <TabsContent
              value="categories"
              className="mt-4 overflow-y-auto max-h-[calc(80vh-12rem)]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Categories</h3>
                  <Button size="sm" onClick={() => setCreateCategoryOpen(true)}>
                    <Plus className="h-4 w-4" />
                    New Category
                  </Button>
                </div>

                {categoriesQuery.isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                )}

                {categoriesQuery.isError && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      Failed to load categories
                    </AlertDescription>
                  </Alert>
                )}

                {categoriesQuery.isSuccess && (
                  <>
                    {categoriesQuery.data.length === 0 ? (
                      <Empty>
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <Settings2 className="h-6 w-6" />
                          </EmptyMedia>
                          <EmptyTitle>No categories yet</EmptyTitle>
                          <EmptyDescription>
                            Create your first category to start organizing your
                            links
                          </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCreateCategoryOpen(true)}
                          >
                            <Plus className="h-4 w-4" />
                            Create your first category
                          </Button>
                        </EmptyContent>
                      </Empty>
                    ) : (
                      <div className="space-y-2">
                        {categoriesQuery.data.map((category) => (
                          <div
                            key={category.id}
                            className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {category.color && (
                                <div
                                  className="w-4 h-4 rounded-full shrink-0"
                                  style={{ backgroundColor: category.color }}
                                />
                              )}
                              <span className="font-medium">
                                {category.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingCategory(category)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeletingCategory(category)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>

            {/* Tags Tab */}
            <TabsContent
              value="tags"
              className="mt-4 overflow-y-auto max-h-[calc(80vh-12rem)]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Tags</h3>
                  <Button size="sm" onClick={() => setCreateTagOpen(true)}>
                    <Plus className="h-4 w-4" />
                    New Tag
                  </Button>
                </div>

                {tagsQuery.isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                )}

                {tagsQuery.isError && (
                  <Alert variant="destructive">
                    <AlertDescription>Failed to load tags</AlertDescription>
                  </Alert>
                )}

                {tagsQuery.isSuccess && (
                  <>
                    {tagsQuery.data.length === 0 ? (
                      <Empty>
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <Plus className="h-6 w-6" />
                          </EmptyMedia>
                          <EmptyTitle>No tags yet</EmptyTitle>
                          <EmptyDescription>
                            Create your first tag to start organizing your links
                          </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCreateTagOpen(true)}
                          >
                            <Plus className="h-4 w-4" />
                            Create your first tag
                          </Button>
                        </EmptyContent>
                      </Empty>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {tagsQuery.data.map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="secondary"
                            className="text-sm px-3 py-1.5 flex items-center gap-2 group"
                          >
                            <span>#{tag.name}</span>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5"
                                onClick={() => setEditingTag(tag)}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5"
                                onClick={() => setDeletingTag(tag)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Create Dialogs */}
      <CreateCategoryDialog
        open={createCategoryOpen}
        onOpenChange={setCreateCategoryOpen}
      />
      <CreateTagDialog open={createTagOpen} onOpenChange={setCreateTagOpen} />

      {/* Edit Dialogs */}
      {editingCategory && (
        <EditCategoryDialog
          category={editingCategory}
          open={!!editingCategory}
          onOpenChange={(open) => !open && setEditingCategory(null)}
        />
      )}
      {editingTag && (
        <EditTagDialog
          tag={editingTag}
          open={!!editingTag}
          onOpenChange={(open) => !open && setEditingTag(null)}
        />
      )}

      {/* Delete Dialogs */}
      {deletingCategory && (
        <DeleteCategoryDialog
          category={deletingCategory}
          open={!!deletingCategory}
          onOpenChange={(open) => !open && setDeletingCategory(null)}
        />
      )}
      {deletingTag && (
        <DeleteTagDialog
          tag={deletingTag}
          open={!!deletingTag}
          onOpenChange={(open) => !open && setDeletingTag(null)}
        />
      )}
    </>
  );
};
