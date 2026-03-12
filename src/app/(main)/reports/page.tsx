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
import { reportService } from "@/services/report.service";
import { IReport } from "@/types/report.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  BarChart3,
  Download,
  FileText,
  Loader2,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ReportsPage() {
  const { hasPermission } = useAuth();
  const queryClient = useQueryClient();
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "reports",
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      search,
    ],
    queryFn: () => {
      const sortParams = sorting
        .map((s) => (s.desc ? `-${s.id}` : s.id))
        .join(",");

      return reportService.getAll({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        ...(sortParams ? { sort: sortParams } : {}),
        ...(search ? { search } : {}),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => reportService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Report deleted successfully");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to delete report"),
    onSettled: () => setIsActionLoading(false),
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this report?")) {
      setIsActionLoading(true);
      deleteMutation.mutate(id);
    }
  };

  const getReportTypeBadge = (type: string) => {
    switch (type) {
      case "leads":
        return (
          <Badge className="bg-blue-500/20 text-blue-500">Leads Analysis</Badge>
        );
      case "tasks":
        return (
          <Badge className="bg-orange-500/20 text-orange-500">
            Task Overview
          </Badge>
        );
      case "audit":
        return (
          <Badge className="bg-purple-500/20 text-purple-500">Audit Logs</Badge>
        );
      case "performance":
        return (
          <Badge className="bg-green-500/20 text-green-500">Performance</Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const columns: ColumnDef<IReport>[] = [
    {
      accessorKey: "name",
      header: "Report Name",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      enableSorting: true,
      cell: ({ row }) => getReportTypeBadge(row.original.type),
    },
    {
      accessorKey: "created_at",
      header: "Generated Date",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">
          {new Date(row.original.created_at).toLocaleString()}
        </span>
      ),
    },
  ];

  if (hasPermission("manage_reports")) {
    columns.push({
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      enableSorting: false,
      cell: ({ row }) => {
        const report = row.original;
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
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Report
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  disabled={isActionLoading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                  onClick={() => handleDelete(report.id)}
                  disabled={isActionLoading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete report
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
          Reports
        </h1>
        {hasPermission("manage_reports") && (
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground group">
            <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
            Generate Report
          </Button>
        )}
      </div>

      <Card className="bg-card border-border backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-card-foreground">Saved Reports</CardTitle>
          <div className="w-64">
            <Input
              placeholder="Search reports..."
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
            <div className="text-destructive">Failed to load reports</div>
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
