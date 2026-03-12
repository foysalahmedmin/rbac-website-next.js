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
import { roleService } from "@/services/role.service";
import { IRole } from "@/types/role.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  Edit,
  KeyRound,
  Loader2,
  MoreHorizontal,
  ShieldPlus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function RolesPage() {
  const { hasPermission } = useAuth();
  const queryClient = useQueryClient();
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "roles",
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      search,
    ],
    queryFn: () => {
      const sortParams = sorting
        .map((s) => (s.desc ? `-${s.id}` : s.id))
        .join(",");

      return roleService.getAll({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        ...(sortParams ? { sort: sortParams } : {}),
        ...(search ? { search } : {}),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => roleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role deleted successfully");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to delete role"),
    onSettled: () => setIsActionLoading(false),
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this role?")) {
      setIsActionLoading(true);
      deleteMutation.mutate(id);
    }
  };

  const columns: ColumnDef<IRole>[] = [
    {
      accessorKey: "name",
      header: "Name",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-medium text-foreground capitalize">
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.description || "No description provided"}
        </span>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Status",
      enableSorting: false,
      cell: ({ row }) =>
        row.original.is_active ? (
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
            Active
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-muted-foreground">
            Inactive
          </Badge>
        ),
    },
  ];

  if (hasPermission("manage_roles")) {
    columns.push({
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      enableSorting: false,
      cell: ({ row }) => {
        const role = row.original;
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
                  <Edit className="mr-2 h-4 w-4" />
                  Edit role
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  disabled={isActionLoading}
                >
                  <KeyRound className="mr-2 h-4 w-4 text-primary" />
                  Manage Permissions
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                  onClick={() => handleDelete(role.id)}
                  disabled={isActionLoading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete role
                </DropdownMenuItem>
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
          Roles
        </h1>
        {hasPermission("manage_roles") && (
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <ShieldPlus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        )}
      </div>

      <Card className="bg-card border-border backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-card-foreground">System Roles</CardTitle>
          <div className="w-64">
            <Input
              placeholder="Search by name..."
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
            <div className="text-destructive">Failed to load roles</div>
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
