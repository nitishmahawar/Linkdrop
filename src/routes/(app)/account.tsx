import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/orpc/client";
import { DeleteAccountDialog } from "@/components/delete-account-dialog";
import { ExportDataDialog } from "@/components/export-data-dialog";
import { EditAccountDialog } from "@/components/edit-account-dialog";
import {
  User,
  Mail,
  Calendar,
  Link as LinkIcon,
  Tag,
  Folder,
  Edit,
  Download,
  Trash2,
  Monitor,
  Moon,
  Sun,
  Star,
} from "lucide-react";
import { format } from "date-fns";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/(app)/account")({
  component: Account,
});

function Account() {
  const user = Route.useRouteContext().user;
  const { theme, setTheme } = useTheme();

  const statsQuery = useQuery(
    orpc.user.getAccountStats.queryOptions({
      input: {},
    })
  );

  const stats = statsQuery.data || {
    totalLinks: 0,
    totalCategories: 0,
    totalTags: 0,
    favoriteLinks: 0,
  };

  const themeOptions = [
    {
      value: "light",
      label: "Light",
      icon: Sun,
      description: "Light mode",
    },
    {
      value: "dark",
      label: "Dark",
      icon: Moon,
      description: "Dark mode",
    },
    {
      value: "system",
      label: "System",
      icon: Monitor,
      description: "Follow system preference",
    },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Account</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Information
            </CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.image!} alt={user.name} />
                <AvatarFallback className="text-lg">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {user.emailVerified && (
                  <Badge variant="secondary" className="mt-1">
                    Verified
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Joined {format(new Date(user.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Your activity overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Links</span>
                </div>
                <p className="text-2xl font-bold">{stats.totalLinks}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Categories</span>
                </div>
                <p className="text-2xl font-bold">{stats.totalCategories}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Tags</span>
                </div>
                <p className="text-2xl font-bold">{stats.totalTags}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Favorites</span>
                </div>
                <p className="text-2xl font-bold">{stats.favoriteLinks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Theme Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Preferences</CardTitle>
          <CardDescription>Choose your preferred color theme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-2xl">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isActive = theme === option.value;

              return (
                <div key={option.value} className="space-y-3">
                  {/* UI Mockup Card */}
                  <button
                    onClick={() => setTheme(option.value)}
                    className={cn(
                      "group relative w-full overflow-hidden rounded-lg border-2 transition-all hover:border-primary/50",
                      isActive
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:bg-accent/50"
                    )}
                  >
                    {/* 16:9 Aspect Ratio Container */}
                    <div className="aspect-video w-full">
                      {/* Light Theme Mockup */}
                      {option.value === "light" && (
                        <div className="h-full w-full bg-white p-3">
                          <div className="mb-2 flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-red-400" />
                            <div className="h-2 w-2 rounded-full bg-yellow-400" />
                            <div className="h-2 w-2 rounded-full bg-green-400" />
                          </div>
                          <div className="space-y-2">
                            <div className="h-3 w-full rounded bg-gray-200" />
                            <div className="flex gap-2">
                              <div className="h-16 w-1/4 rounded bg-gray-100 border border-gray-200" />
                              <div className="flex-1 space-y-2">
                                <div className="h-3 w-3/4 rounded bg-gray-200" />
                                <div className="h-3 w-1/2 rounded bg-gray-100" />
                                <div className="h-3 w-2/3 rounded bg-gray-200" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Dark Theme Mockup */}
                      {option.value === "dark" && (
                        <div className="h-full w-full bg-zinc-950 p-3">
                          <div className="mb-2 flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-red-400" />
                            <div className="h-2 w-2 rounded-full bg-yellow-400" />
                            <div className="h-2 w-2 rounded-full bg-green-400" />
                          </div>
                          <div className="space-y-2">
                            <div className="h-3 w-full rounded bg-zinc-800" />
                            <div className="flex gap-2">
                              <div className="h-16 w-1/4 rounded bg-zinc-900 border border-zinc-800" />
                              <div className="flex-1 space-y-2">
                                <div className="h-3 w-3/4 rounded bg-zinc-800" />
                                <div className="h-3 w-1/2 rounded bg-zinc-900" />
                                <div className="h-3 w-2/3 rounded bg-zinc-800" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* System Theme Mockup */}
                      {option.value === "system" && (
                        <div className="flex h-full w-full">
                          {/* Light Half */}
                          <div className="w-1/2 bg-white p-2 border-r">
                            <div className="mb-1.5 flex items-center gap-1">
                              <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
                              <div className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                            </div>
                            <div className="space-y-1.5">
                              <div className="h-2 w-full rounded bg-gray-200" />
                              <div className="flex gap-1">
                                <div className="h-10 w-1/3 rounded bg-gray-100" />
                                <div className="flex-1 space-y-1">
                                  <div className="h-2 w-full rounded bg-gray-200" />
                                  <div className="h-2 w-2/3 rounded bg-gray-100" />
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Dark Half */}
                          <div className="w-1/2 bg-zinc-950 p-2">
                            <div className="mb-1.5 flex items-center gap-1">
                              <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
                              <div className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                            </div>
                            <div className="space-y-1.5">
                              <div className="h-2 w-full rounded bg-zinc-800" />
                              <div className="flex gap-1">
                                <div className="h-10 w-1/3 rounded bg-zinc-900" />
                                <div className="flex-1 space-y-1">
                                  <div className="h-2 w-full rounded bg-zinc-800" />
                                  <div className="h-2 w-2/3 rounded bg-zinc-900" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute right-3 top-3">
                        <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-lg" />
                      </div>
                    )}
                  </button>

                  {/* Theme Info - Outside the card */}
                  <div className="flex items-center gap-2 px-1">
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <div
                      className={cn(
                        "font-medium text-sm transition-colors",
                        isActive ? "text-primary" : "text-foreground"
                      )}
                    >
                      {option.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <EditAccountDialog
              trigger={
                <Button variant="outline">
                  <Edit />
                  Edit Account
                </Button>
              }
            />

            <ExportDataDialog
              trigger={
                <Button variant="outline">
                  <Download />
                  Export Data
                </Button>
              }
            />
            <DeleteAccountDialog
              trigger={
                <Button variant="destructive">
                  <Trash2 />
                  Delete Account
                </Button>
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
