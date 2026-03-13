"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { auditLogService } from "@/services/audit-log.service";
import { IAuditLog } from "@/types/audit-log.type";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  Activity,
  Calendar,
  Database,
  Fingerprint,
  History,
  Loader2,
  Search,
  ShieldCheck,
  User,
} from "lucide-react";
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
        return "bg-success/10 text-success border-success/20";
      case "update":
        return "bg-info/10 text-info border-info/20";
      case "delete":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "login":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const columns: ColumnDef<IAuditLog>[] = [
    {
      accessorKey: "created_at",
      header: "Event Timestamp",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
            <Calendar size={12} className="text-muted-foreground/60" />
            {new Date(row.original.created_at).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">
            <History size={10} />
            {new Date(row.original.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "user",
      header: "Actor",
      enableSorting: false,
      cell: ({ row }) => {
        const user = row.original.user;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-7 w-7 border border-border/50">
              <AvatarImage
                src={`https://avatar.iran.liara.run/public/${row.original.user_id % 100}`}
              />
              <AvatarFallback className="text-[10px] bg-muted capitalize">
                {user?.name?.charAt(0) || "S"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground leading-none">
                {user?.name || "System"}
              </span>
              <span className="text-[10px] text-muted-foreground mt-1">
                {user?.email || "internal_event"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Operational Action",
      enableSorting: true,
      cell: ({ row }) => (
        <Badge
          className={`${getActionBadgeColor(row.original.action)} font-black uppercase text-[10px] tracking-tight`}
        >
          {row.original.action}
        </Badge>
      ),
    },
    {
      accessorKey: "resource",
      header: "Target Resource",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-muted flex items-center justify-center">
            <Database size={12} className="text-muted-foreground" />
          </div>
          <span className="capitalize text-xs font-bold text-foreground/80">
            {row.original.resource}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "resource_id",
      header: "Entry ID",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Fingerprint size={12} className="text-muted-foreground/40" />
          <span className="text-xs font-mono font-bold text-muted-foreground">
            {row.original.resource_id ? `#${row.original.resource_id}` : "N/A"}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-primary" />
          Security Audit
        </h1>
        <p className="text-muted-foreground text-sm font-semibold">
          Immutable logs of all administrative and system-wide modifications.
        </p>
      </div>

      {/* Audit Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Events",
            value: data?.meta?.total || "0",
            icon: Activity,
            color: "text-primary",
          },
          {
            label: "Critical Actions",
            value: "24",
            icon: ShieldCheck,
            color: "text-destructive",
          },
          {
            label: "Active Users",
            value: "8",
            icon: User,
            color: "text-success",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-card/40 border-border/50 border rounded-2xl p-6 flex flex-col gap-2 shadow-xs transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                {stat.label}
              </span>
              <stat.icon size={16} className={stat.color} />
            </div>
            <p className="text-3xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      <Card className="bg-card/50 border-border backdrop-blur-3xl shadow-2xl rounded-3xl overflow-hidden ring-1 ring-border/30">
        <CardHeader className="bg-muted/10 border-b border-border/40 px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <CardTitle className="text-xl font-black">
                History Ledger
              </CardTitle>
              <CardDescription className="text-xs font-medium">
                Verify system integrity through detailed movement tracking.
              </CardDescription>
            </div>
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
              <Input
                placeholder="Search resources, actions..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
                className="h-12 pl-10 border-border/40 bg-background/30 focus:bg-background transition-all rounded-2xl shadow-inner font-bold"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-24 space-y-6">
              <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
              <p className="text-xs font-black tracking-widest text-muted-foreground uppercase animate-pulse">
                Decrypting Security Logs
              </p>
            </div>
          ) : error || !data ? (
            <div className="p-20 text-center space-y-4">
              <p className="text-destructive font-black text-lg underline decoration-wavy">
                Stream Interrupted
              </p>
              <p className="text-muted-foreground text-sm">
                Could not establish a secure connection to the audit vault.
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
  );
}
