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
import { leadService } from "@/services/lead.service";
import { ILead } from "@/types/lead.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { Edit, Loader2, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function LeadsPage() {
  const { hasPermission } = useAuth();
  const queryClient = useQueryClient();
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "leads",
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      search,
    ],
    queryFn: () => {
      const sortParams = sorting
        .map((s) => (s.desc ? `-${s.id}` : s.id))
        .join(",");

      return leadService.getAll({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        ...(sortParams ? { sort: sortParams } : {}),
        ...(search ? { search } : {}),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => leadService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead deleted successfully");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to delete lead"),
    onSettled: () => setIsActionLoading(false),
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      setIsActionLoading(true);
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30">
            New
          </Badge>
        );
      case "contacted":
        return (
          <Badge className="bg-orange-500/20 text-orange-500 hover:bg-orange-500/30">
            Contacted
          </Badge>
        );
      case "qualified":
        return (
          <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">
            Qualified
          </Badge>
        );
      case "lost":
        return <Badge variant="destructive">Lost</Badge>;
      case "won":
        return (
          <Badge className="bg-primary text-primary-foreground">Won</Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const columns: ColumnDef<ILead>[] = [
    {
      accessorKey: "name",
      header: "Name",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="font-medium text-foreground">
          {row.original.first_name} {row.original.last_name}
        </span>
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
      accessorKey: "source",
      header: "Source",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.source || "Unknown"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: "created_at",
      header: "Created",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">
          {new Date(row.original.created_at).toLocaleDateString()}
        </span>
      ),
    },
  ];

  if (hasPermission("manage_leads")) {
    columns.push({
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      enableSorting: false,
      cell: ({ row }) => {
        const lead = row.original;
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
                  Edit lead
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                  onClick={() => handleDelete(lead.id)}
                  disabled={isActionLoading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete lead
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
          Leads
        </h1>
        {hasPermission("manage_leads") && (
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground group">
            <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
            Add Lead
          </Button>
        )}
      </div>

      <Card className="bg-card border-border backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-card-foreground">
            Lead Management
          </CardTitle>
          <div className="w-64">
            <Input
              placeholder="Search leads..."
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
            <div className="text-destructive">Failed to load leads</div>
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
