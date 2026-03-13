"use client";

import { PermissionManager } from "@/components/dashboard/permission-manager";
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
import { roleService } from "@/services/role.service";
import { IRole } from "@/types/role.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  Edit,
  KeyRound,
  Loader2,
  Lock,
  MoreHorizontal,
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
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

  // Permission Manager State
  const [isPermManagerOpen, setIsPermManagerOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<IRole | null>(null);

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
        include: "permissions",
        ...(sortParams ? { sort: sortParams } : {}),
        ...(search ? { search } : {}),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => roleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Security role dismantled");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to delete group"),
    onSettled: () => setIsActionLoading(false),
  });

  const handleDelete = (id: number) => {
    if (
      confirm(
        "Dismantle this role? This might affect several users' access rights.",
      )
    ) {
      setIsActionLoading(true);
      deleteMutation.mutate(id);
    }
  };

  const handleOpenPermManager = (role: IRole) => {
    setSelectedRole(role);
    setIsPermManagerOpen(true);
  };

  const columns: ColumnDef<IRole>[] = [
    {
      accessorKey: "name",
      header: "Security Tier",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${row.original.name === "admin" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
          >
            <ShieldCheck size={18} />
          </div>
          <span className="font-black text-foreground capitalize tracking-tight">
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Responsibility Scope",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-xs font-medium text-muted-foreground line-clamp-1 max-w-[400px]">
          {row.original.description ||
            "Standard access profiling without detailed description."}
        </span>
      ),
    },
    {
      id: "permissions_count",
      header: "Auth Count",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="bg-primary/5 text-primary border-primary/20 font-bold whitespace-nowrap"
        >
          {row.original.permissions?.length || 0} Permissions
        </Badge>
      ),
    },
  ];

  if (hasPermission("manage_roles")) {
    columns.push({
      id: "actions",
      header: () => <div className="text-right">Configure</div>,
      enableSorting: false,
      cell: ({ row }) => {
        const role = row.original;
        const isSystemRole = role.name === "admin";
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-accent rounded-full transition-all"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 rounded-2xl p-2 shadow-2xl"
              >
                <DropdownMenuLabel className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-2 py-1">
                  Identity Management
                </DropdownMenuLabel>
                <DropdownMenuItem className="rounded-xl cursor-pointer">
                  <Edit className="mr-2 h-4 w-4 text-muted-foreground" />
                  Rename Security Tier
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-xl cursor-pointer font-bold text-primary"
                  onClick={() => handleOpenPermManager(role)}
                >
                  <KeyRound className="mr-2 h-4 w-4" />
                  Adjust Permissions
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                {!isSystemRole ? (
                  <DropdownMenuItem
                    className="rounded-xl cursor-pointer text-destructive focus:bg-destructive/10"
                    onClick={() => handleDelete(role.id)}
                    disabled={isActionLoading}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Dismantle Role
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    disabled
                    className="rounded-xl text-muted-foreground/50 italic text-xs"
                  >
                    <Lock className="mr-2 h-3 w-3" />
                    System Protected
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
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      {selectedRole && (
        <PermissionManager
          isOpen={isPermManagerOpen}
          onClose={() => {
            setIsPermManagerOpen(false);
            setSelectedRole(null);
          }}
          targetId={selectedRole.id}
          targetName={selectedRole.name}
          targetType="role"
          currentPermissionIds={
            selectedRole.permissions?.map((p) => p.permission.id) || []
          }
          onSave={(ids) => roleService.assignPermissions(selectedRole.id, ids)}
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
            <ShieldPlus className="text-primary h-8 w-8" />
            Access Tiers
          </h1>
          <p className="text-muted-foreground text-sm font-semibold">
            Define user groups and their respective authorization boundaries.
          </p>
        </div>
        {hasPermission("manage_roles") && (
          <Button className="h-11 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 group">
            <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
            Initialize Tier
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/40 border-border/50 backdrop-blur-3xl shadow-2xl rounded-3xl overflow-hidden md:col-span-2">
          <CardHeader className="bg-linear-to-b from-muted/20 to-transparent border-b border-border/40 px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <CardTitle className="text-xl font-black italic">
                  Active Authority Schema
                </CardTitle>
                <CardDescription className="text-xs font-bold uppercase tracking-wide opacity-70">
                  Registry of configured system roles
                </CardDescription>
              </div>
              <div className="relative w-full md:w-80 group">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Locate security tier..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                  }}
                  className="h-11 pl-10 border-border/40 bg-background/30 focus:bg-background transition-all rounded-2xl font-bold"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-24">
                <Loader2 className="h-10 w-10 animate-spin text-primary/40 ring-4 ring-primary/5 rounded-full p-2" />
                <p className="mt-4 text-[10px] font-black tracking-widest uppercase text-muted-foreground animate-pulse">
                  Scanning Role Map...
                </p>
              </div>
            ) : error || !data ? (
              <div className="p-20 text-center space-y-4">
                <ShieldAlert
                  size={48}
                  className="mx-auto text-destructive/30"
                />
                <p className="text-destructive font-black">
                  Hierarchy Retrieval Denied
                </p>
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
    </div>
  );
}
