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
import { ChangePasswordDialog } from "@/components/change-password-dialog";
import { EditAccountDialog } from "@/components/edit-account-dialog";
import {
  User,
  Mail,
  Calendar,
  Link as LinkIcon,
  Tag,
  Folder,
  Edit,
  Key,
  Download,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export const Route = createFileRoute("/(app)/account")({
  component: Account,
});

function Account() {
  const user = Route.useRouteContext().user;

  const linksQuery = useQuery(
    orpc.links.list.queryOptions({
      input: { limit: 1, offset: 0 },
    })
  );

  const linksCount = linksQuery.data?.total || 0;

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
                <p className="text-2xl font-bold">{linksCount}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Categories</span>
                </div>
                <p className="text-2xl font-bold">-</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Tags</span>
                </div>
                <p className="text-2xl font-bold">-</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Member Since</span>
                </div>
                <p className="text-sm">
                  {format(new Date(user.createdAt), "MMM yyyy")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
            <ChangePasswordDialog
              trigger={
                <Button variant="outline">
                  <Key />
                  Change Password
                </Button>
              }
            />
            <Button variant="outline">
              <Download />
              Export Data
            </Button>
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