"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { auditLogService } from "@/services/audit-log.service";
import { IAuditLog } from "@/types/audit-log.type";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { Activity, Loader2 } from "lucide-react";
import { useState } from "react";

export default function AuditLogsPage() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "audit-logs",
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      search,
    ],
    queryFn: () => {
      const sortParams = sorting
        .map((s) => (s.desc ? `-${s.id}` : s.id))
        .join(",");

      return auditLogService.getAll({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        ...(sortParams ? { sort: sortParams } : {}),
        ...(search ? { search } : {}),
      });
    },
  });

  const getActionBadgeColor = (action: string) => {
    switch (action.toLowerCase()) {
      case "create":
        return "bg-success/20 text-success hover:bg-success/30";
      case "update":
        return "bg-info/20 text-info hover:bg-info/30";
      case "delete":
        return "bg-destructive/20 text-destructive hover:bg-destructive/30";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const columns: ColumnDef<IAuditLog>[] = [
    {
      accessorKey: "created_at",
      header: "Timestamp",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-medium text-muted-foreground">
          {new Date(row.original.created_at).toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "user",
      header: "User",
      enableSorting: false,
      cell: ({ row }) => {
        const user = row.original.user;
        return (
          <span className="text-foreground">
            {user ? `${user.name} (${user.email})` : "System"}
          </span>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      enableSorting: true,
      cell: ({ row }) => (
        <Badge className={getActionBadgeColor(row.original.action)}>
          {row.original.action}
        </Badge>
      ),
    },
    {
      accessorKey: "resource",
      header: "Resource",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="capitalize text-primary font-medium">
          {row.original.resource}
        </span>
      ),
    },
    {
      accessorKey: "resource_id",
      header: "Record ID",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-muted-foreground font-mono text-sm">
          {row.original.resource_id || "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Activity className="h-8 w-8 text-primary" />
          Audit Logs
        </h1>
      </div>

      <Card className="bg-card border-border backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-card-foreground">
            System Activity History
          </CardTitle>
          <div className="w-64">
            <Input
              placeholder="Search resource or action..."
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
            <div className="text-destructive">Failed to load audit logs</div>
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
