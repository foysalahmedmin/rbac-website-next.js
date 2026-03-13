"use client";

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
import { leadService } from "@/services/lead.service";
import { ILead } from "@/types/lead.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  Globe,
  Loader2,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  Target,
  Trash2,
  TrendingUp,
} from "lucide-react";
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
      toast.success("Lead record deleted");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to remove lead"),
    onSettled: () => setIsActionLoading(false),
  });

  const handleDelete = (id: number) => {
    if (
      confirm("Delete this lead permanently? This action cannot be undone.")
    ) {
      setIsActionLoading(true);
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; class: string }> = {
      new: {
        label: "New",
        class: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      },
      contacted: {
        label: "Contacted",
        class: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      },
      qualified: {
        label: "Qualified",
        class: "bg-green-500/10 text-green-500 border-green-500/20",
      },
      lost: {
        label: "Lost",
        class: "bg-destructive/10 text-destructive border-destructive/20",
      },
      won: {
        label: "Won",
        class: "bg-primary/10 text-primary border-primary/20",
      },
    };

    const config = configs[status] || {
      label: status,
      class: "bg-muted text-muted-foreground",
    };

    return (
      <Badge className={`${config.class} font-bold px-2 py-0.5`}>
        {config.label}
      </Badge>
    );
  };

  const columns: ColumnDef<ILead>[] = [
    {
      accessorKey: "name",
      header: "Lead Contact",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-foreground">
            {row.original.first_name} {row.original.last_name}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 font-medium">
            <Mail size={12} className="text-primary/60" />
            {row.original.email}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "source",
      header: "Origin Source",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-muted/50 text-muted-foreground">
            <Globe size={14} />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {row.original.source || "Organic"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Progress Status",
      enableSorting: true,
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: "created_at",
      header: "Acquisition Date",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar size={14} className="opacity-60" />
          <span className="text-xs font-semibold">
            {new Date(row.original.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
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
                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-accent">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 rounded-xl">
                <DropdownMenuLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Pipeline
                </DropdownMenuLabel>
                <DropdownMenuItem className="cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Details
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-primary">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark as Won
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:bg-destructive/10"
                  onClick={() => handleDelete(lead.id)}
                  disabled={isActionLoading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Lead
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    });
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <Target className="text-primary h-8 w-8" />
            Sales Leads
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Capture, track and nurture potential customers through your
            pipeline.
          </p>
        </div>
        {hasPermission("manage_leads") && (
          <Button className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 group">
            <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
            New Acquisition
          </Button>
        )}
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Pipeline",
            value: data?.meta?.total || "0",
            icon: Briefcase,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Conversion Rate",
            value: "24.2%",
            icon: TrendingUp,
            color: "text-success",
            bg: "bg-success/10",
          },
          {
            label: "Avg. Cycle",
            value: "12 Days",
            icon: Clock,
            color: "text-info",
            bg: "bg-info/10",
          },
          {
            label: "New Leads",
            value: "8",
            icon: Plus,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="bg-card/40 border-border/50 backdrop-blur-sm"
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-extrabold tracking-widest text-muted-foreground/60">
                  {stat.label}
                </p>
                <p className="text-2xl font-black leading-tight mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`h-11 w-11 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center`}
              >
                <stat.icon size={20} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card/50 border-border backdrop-blur-xl shadow-md rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/10 px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold">
                Inquiry Management
              </CardTitle>
              <CardDescription className="text-xs">
                Sort and filter through your active sales opportunities
              </CardDescription>
            </div>
            <div className="relative w-full md:w-72 group">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground focus:text-primary transition-colors" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
                className="h-10 pl-10 border-border/50 bg-background/50 focus:bg-background transition-all rounded-xl"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary opacity-40" />
              <p className="text-sm font-bold text-muted-foreground tracking-wide uppercase">
                Fetching Records...
              </p>
            </div>
          ) : error || !data ? (
            <div className="p-20 text-center">
              <p className="text-destructive font-bold">
                Failed to sync leads pipeline.
              </p>
              <Button
                variant="link"
                onClick={() =>
                  queryClient.invalidateQueries({ queryKey: ["leads"] })
                }
              >
                Try Refreshing
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
