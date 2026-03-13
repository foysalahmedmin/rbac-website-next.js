"use client";

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
import { taskService } from "@/services/task.service";
import { ITask } from "@/types/task.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Edit,
  LayoutList,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function TasksPage() {
  const { hasPermission } = useAuth();
  const queryClient = useQueryClient();
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "tasks",
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      search,
    ],
    queryFn: () => {
      const sortParams = sorting
        .map((s) => (s.desc ? `-${s.id}` : s.id))
        .join(",");

      return taskService.getAll({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        ...(sortParams ? { sort: sortParams } : {}),
        ...(search ? { search } : {}),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => taskService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task record removed");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to remove task"),
    onSettled: () => setIsActionLoading(false),
  });

  const handleDelete = (id: number) => {
    if (confirm("Confirm task deletion? This cannot be undone.")) {
      setIsActionLoading(true);
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: {
        label: "Pending",
        color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      },
      "in-progress": {
        label: "In Progress",
        color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      },
      completed: {
        label: "Completed",
        color: "bg-green-500/10 text-green-500 border-green-500/20",
      },
      "on-hold": {
        label: "On Hold",
        color: "bg-muted text-muted-foreground border-border",
      },
    };

    const config = statusMap[status] || {
      label: status,
      color: "bg-muted text-muted-foreground",
    };

    return (
      <Badge className={`${config.color} font-bold px-2 py-0.5`}>
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap: Record<string, { label: string; color: string }> = {
      critical: {
        label: "Critical",
        color: "bg-destructive text-destructive-foreground",
      },
      high: {
        label: "High",
        color: "bg-red-500/10 text-red-500 border-red-500/20",
      },
      medium: {
        label: "Medium",
        color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      },
      low: {
        label: "Low",
        color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      },
    };

    const config = priorityMap[priority] || {
      label: priority,
      color: "bg-muted text-muted-foreground",
    };

    return (
      <div className="flex items-center gap-1.5">
        <div
          className={`h-1.5 w-1.5 rounded-full ${priority === "critical" ? "bg-white" : config.color.split(" ")[1].replace("text-", "bg-")}`}
        />
        <Badge
          className={`${config.color} font-extrabold text-[10px] uppercase tracking-tighter`}
        >
          {config.label}
        </Badge>
      </div>
    );
  };

  const columns: ColumnDef<ITask>[] = [
    {
      accessorKey: "title",
      header: "Task Subject",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-foreground leading-tight">
            {row.original.title}
          </span>
          <span className="text-xs text-muted-foreground line-clamp-1 max-w-[250px]">
            {row.original.description || "No specific details provided."}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Current Status",
      enableSorting: true,
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: "assignee",
      header: "Assigned To",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 border border-primary/10">
            <AvatarImage
              src={`https://avatar.iran.liara.run/public/${row.original.assignee?.id || 0}`}
            />
            <AvatarFallback className="text-[10px] bg-primary/5 text-primary">
              {row.original.assignee?.name?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-bold text-muted-foreground truncate max-w-[100px]">
            {row.original.assignee?.name || "Open Pool"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority Level",
      enableSorting: true,
      cell: ({ row }) => getPriorityBadge(row.original.priority),
    },
    {
      accessorKey: "due_date",
      header: "Deadline",
      enableSorting: true,
      cell: ({ row }) => {
        const date = row.original.due_date;
        const isOverdue =
          date &&
          new Date(date) < new Date() &&
          row.original.status !== "completed";
        return (
          <div
            className={`flex items-center gap-1.5 text-xs font-bold ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}
          >
            <Clock size={12} className={isOverdue ? "animate-pulse" : ""} />
            {date
              ? new Date(date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })
              : "Flexible"}
          </div>
        );
      },
    },
  ];

  if (hasPermission("manage_tasks")) {
    columns.push({
      id: "actions",
      header: () => <div className="text-right">Manage</div>,
      enableSorting: false,
      cell: ({ row }) => {
        const task = row.original;
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
                className="w-48 rounded-xl p-2 shadow-xl border-border/50"
              >
                <DropdownMenuLabel className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-2 py-1">
                  Task Operations
                </DropdownMenuLabel>
                <DropdownMenuItem className="rounded-lg cursor-pointer">
                  <Edit className="mr-2 h-4 w-4 text-primary/70" />
                  Edit Task Info
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg cursor-pointer text-success">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Finalize Task
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 mx-2" />
                <DropdownMenuItem
                  className="rounded-lg cursor-pointer text-destructive focus:bg-destructive/10"
                  onClick={() => handleDelete(task.id)}
                  disabled={isActionLoading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Erase Permanently
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    });
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
            <LayoutList className="text-primary h-8 w-8" />
            Work Assignments
          </h1>
          <p className="text-muted-foreground text-sm font-semibold italic">
            Organize, delegate, and track team productivity in real-time.
          </p>
        </div>
        {hasPermission("manage_tasks") && (
          <Button className="h-11 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 group border-b-4 border-primary/50">
            <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
            Create Blueprint
          </Button>
        )}
      </div>

      {/* Modern Stats Display */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Active",
            value: data?.meta?.total || "0",
            icon: Clock,
            color: "text-blue-500",
            border: "border-blue-500/20",
          },
          {
            label: "Done",
            value: "14",
            icon: CheckCircle2,
            color: "text-success",
            border: "border-success/20",
          },
          {
            label: "Urgent",
            value: "3",
            icon: AlertCircle,
            color: "text-destructive",
            border: "border-destructive/20",
          },
          {
            label: "Team Cap",
            value: "85%",
            icon: LayoutList,
            color: "text-primary",
            border: "border-primary/20",
          },
        ].map((item, i) => (
          <div
            key={i}
            className={`p-4 rounded-2xl bg-card/60 backdrop-blur-md border ${item.border} shadow-sm flex flex-col gap-2 transition-transform hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                {item.label}
              </p>
              <item.icon size={14} className={item.color} />
            </div>
            <p className="text-2xl font-black tracking-tighter">{item.value}</p>
          </div>
        ))}
      </div>

      <Card className="bg-card/40 border-border/50 backdrop-blur-3xl shadow-2xl rounded-3xl overflow-hidden border-t-0 ring-1 ring-border/20">
        <CardHeader className="bg-linear-to-r from-muted/30 to-background/10 px-8 py-6 border-b border-border/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <CardTitle className="text-xl font-black tracking-tight">
                Active Duty List
              </CardTitle>
              <CardDescription className="text-xs font-medium">
                Filter and manage mission-critical task flow.
              </CardDescription>
            </div>
            <div className="relative w-full md:w-80 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <Input
                placeholder="Locate via subject or detail..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
                className="h-12 pl-10 border-border/40 bg-background/30 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl font-medium shadow-inner"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-24 space-y-6">
              <div className="relative">
                <Loader2 className="h-16 w-16 animate-spin text-primary opacity-20" />
                <LayoutList className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary animate-pulse" />
              </div>
              <p className="text-xs font-black tracking-widest text-muted-foreground uppercase animate-pulse">
                Synchronizing Data Ops
              </p>
            </div>
          ) : error || !data ? (
            <div className="p-20 text-center space-y-4">
              <p className="text-destructive font-black text-lg">
                System Outage
              </p>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                We encountered an uplink error while syncing task data. Please
                re-initiate.
              </p>
              <Button
                variant="secondary"
                onClick={() =>
                  queryClient.invalidateQueries({ queryKey: ["tasks"] })
                }
                className="rounded-xl"
              >
                Re-initiate Workflow
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
