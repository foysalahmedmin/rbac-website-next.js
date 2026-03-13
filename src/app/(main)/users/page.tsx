"use client";

import { PermissionManager } from "@/components/dashboard/permission-manager";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  KeyRound,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  UserCheck,
  UserCog,
  Users,
  UserX,
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

  // Permission Manager State
  const [isPermManagerOpen, setIsPermManagerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

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
        include: "direct_permissions",
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

  const handleOpenPermManager = (user: IUser) => {
    setSelectedUser(user);
    setIsPermManagerOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-success/20 text-success border-success/20 animate-pulse-slow">
            Active
          </Badge>
        );
      case "suspended":
        return (
          <Badge className="bg-warning/20 text-warning border-warning/20">
            Suspended
          </Badge>
        );
      case "banned":
        return (
          <Badge className="bg-destructive/20 text-destructive border-destructive/20">
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
      header: "User",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-primary/10 shadow-xs">
            <AvatarImage
              src={`https://avatar.iran.liara.run/public/${row.original.id % 100}`}
            />
            <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
              {row.original.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground leading-tight">
              {row.original.name}
            </span>
            <span className="text-xs text-muted-foreground">
              ID: #{row.original.id}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email Address",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-muted-foreground font-medium">
          {row.original.email}
        </span>
      ),
    },
    {
      accessorKey: "role",
      header: "System Role",
      enableSorting: false,
      cell: ({ row }) => {
        const role = row.original.role.name;
        const isAdmin = role === "admin";
        return (
          <div className="flex items-center gap-2">
            <div
              className={`p-1 rounded-md ${isAdmin ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            <span
              className={`text-sm font-bold capitalize ${isAdmin ? "text-primary" : "text-muted-foreground"}`}
            >
              {role}
            </span>
          </div>
        );
      },
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
                  className="h-8 w-8 p-0 hover:bg-accent transition-colors"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl p-2">
                <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1.5 uppercase font-bold tracking-wider">
                  Management
                </DropdownMenuLabel>
                <DropdownMenuItem className="rounded-lg cursor-pointer">
                  <UserCog className="mr-2 h-4 w-4 text-muted-foreground" />
                  Edit Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-lg cursor-pointer"
                  onClick={() => handleOpenPermManager(user)}
                >
                  <KeyRound className="mr-2 h-4 w-4 text-primary" />
                  Manage Permissions
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1.5 uppercase font-bold tracking-wider">
                  Account Action
                </DropdownMenuLabel>
                {user.status !== "suspended" && (
                  <DropdownMenuItem
                    className="rounded-lg cursor-pointer text-warning focus:text-warning focus:bg-warning/10"
                    onClick={() => handleSuspend(user.id)}
                    disabled={isActionLoading}
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Suspend User
                  </DropdownMenuItem>
                )}
                {user.status !== "banned" && (
                  <DropdownMenuItem
                    className="rounded-lg cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                    onClick={() => handleBan(user.id)}
                    disabled={isActionLoading}
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    Ban Account
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
    <div className="space-y-8 animate-in fade-in duration-500">
      {selectedUser && (
        <PermissionManager
          isOpen={isPermManagerOpen}
          onClose={() => {
            setIsPermManagerOpen(false);
            setSelectedUser(null);
          }}
          targetId={selectedUser.id}
          targetName={selectedUser.name}
          targetType="user"
          currentPermissionIds={
            selectedUser.direct_permissions?.map((p) => p.permission.id) || []
          }
          onSave={(ids: number[]) =>
            userService.assignPermissions(selectedUser.id, ids)
          }
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            User Management
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Manage your organization&apos;s users, roles and high-level permissions.
          </p>
        </div>
        {hasPermission("manage_users") && (
          <Button className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 group">
            <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
            Create New User
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Users",
            value: "156",
            icon: Users,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Active Now",
            value: "142",
            icon: UserCheck,
            color: "text-success",
            bg: "bg-success/10",
          },
          {
            label: "Suspended",
            value: "8",
            icon: Ban,
            color: "text-warning",
            bg: "bg-warning/10",
          },
          {
            label: "Banned",
            value: "6",
            icon: UserX,
            color: "text-destructive",
            bg: "bg-destructive/10",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="bg-card/40 border-border/50 backdrop-blur-sm shadow-xs"
          >
            <CardContent className="p-4 flex items-center gap-4">
              <div
                className={`h-12 w-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}
              >
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/70">
                  {stat.label}
                </p>
                <p className="text-xl font-extrabold leading-none mt-1">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card/50 border-border backdrop-blur-xl shadow-md rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/20 px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold">
                Directory List
              </CardTitle>
              <CardDescription className="text-xs">
                Browse and manage all registered accounts
              </CardDescription>
            </div>
            <div className="relative w-full md:w-72 group">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Find by name, email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
                className="h-10 pl-10 bg-background/50 border-border/50 focus:bg-background transition-all rounded-xl"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
              <p className="text-sm font-medium text-muted-foreground animate-pulse">
                Syncing directory...
              </p>
            </div>
          ) : error || !data ? (
            <div className="p-20 text-center space-y-4">
              <div className="h-16 w-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
                <UserX size={32} />
              </div>
              <p className="text-destructive font-bold text-lg">
                Connection Error
              </p>
              <p className="text-muted-foreground max-w-xs mx-auto">
                We couldn&apos;t retrieve the user list. Please check your
                network or try again.
              </p>
              <Button
                variant="outline"
                onClick={() =>
                  queryClient.invalidateQueries({ queryKey: ["users"] })
                }
              >
                Retry Connection
              </Button>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={data?.data || []}
              pageCount={data?.meta?.total_page || 1}
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
