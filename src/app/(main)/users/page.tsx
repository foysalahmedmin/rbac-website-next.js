"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/auth-provider";
import { userService } from "@/services/user.service";
import { IUser } from "@/types/user.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  Ban,
  Loader2,
  MoreHorizontal,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function UsersPage() {
  const { hasPermission } = useAuth();
  const queryClient = useQueryClient();
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "users",
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      search,
    ],
    queryFn: () => {
      const sortParams = sorting
        .map((s) => (s.desc ? `-${s.id}` : s.id))
        .join(",");

      return userService.getAll({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        ...(sortParams ? { sort: sortParams } : {}),
        ...(search ? { search } : {}),
      });
    },
  });

  const suspendMutation = useMutation({
    mutationFn: (id: number) => userService.suspend(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User suspended successfully");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to suspend user"),
    onSettled: () => setIsActionLoading(false),
  });

  const banMutation = useMutation({
    mutationFn: (id: number) => userService.ban(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User banned successfully");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to ban user"),
    onSettled: () => setIsActionLoading(false),
  });

  const handleSuspend = (id: number) => {
    setIsActionLoading(true);
    suspendMutation.mutate(id);
  };

  const handleBan = (id: number) => {
    setIsActionLoading(true);
    banMutation.mutate(id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
            Active
          </Badge>
        );
      case "suspended":
        return (
          <Badge className="bg-destructive/20 text-destructive hover:bg-destructive/30">
            Suspended
          </Badge>
        );
      case "banned":
        return (
          <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive/80">
            Banned
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const columns: ColumnDef<IUser>[] = [
    {
      accessorKey: "name",
      header: "Name",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-medium text-foreground">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.email}</span>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground capitalize">
            {typeof row.original.role === "string"
              ? row.original.role
              : (row.original.role as { name: string })?.name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
  ];

  if (hasPermission("manage_users")) {
    columns.push({
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      enableSorting: false,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-popover border-border text-foreground"
              >
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  className="cursor-pointer"
                  disabled={isActionLoading}
                >
                  <UserCog className="mr-2 h-4 w-4" />
                  Edit user
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                {user.status !== "suspended" && (
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                    onClick={() => handleSuspend(user.id)}
                    disabled={isActionLoading}
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Suspend user
                  </DropdownMenuItem>
                )}
                {user.status !== "banned" && (
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                    onClick={() => handleBan(user.id)}
                    disabled={isActionLoading}
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Ban user
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Users
        </h1>
        {hasPermission("manage_users") && (
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Add User
          </Button>
        )}
      </div>

      <Card className="bg-card border-border backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-card-foreground">All Users</CardTitle>
          <div className="w-64">
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
              className="bg-background border-border"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error || !data ? (
            <div className="text-destructive">Failed to load users</div>
          ) : (
            <DataTable
              columns={columns}
              data={data.data}
              pageCount={data.meta?.total_page || 1}
              pagination={pagination}
              onPaginationChange={setPagination}
              sorting={sorting}
              onSortingChange={(updater) => {
                setSorting(updater);
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
