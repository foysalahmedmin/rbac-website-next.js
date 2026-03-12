"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auditLogService } from "@/services/audit-log.service";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Activity, Loader2 } from "lucide-react";

export default function AuditLogsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: () => auditLogService.getAll(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !data) {
    return <div className="text-red-400">Failed to load audit logs</div>;
  }

  const getActionBadgeColor = (action: string) => {
    switch (action.toLowerCase()) {
      case "create":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "update":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "delete":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <Activity className="h-8 w-8 text-blue-400" />
          Audit Logs
        </h1>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-gray-200">
            System Activity History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-white/10 overflow-hidden">
            <Table>
              <TableHeader className="bg-black/20">
                <TableRow className="border-white/10">
                  <TableHead className="text-gray-400">Timestamp</TableHead>
                  <TableHead className="text-gray-400">User</TableHead>
                  <TableHead className="text-gray-400">Action</TableHead>
                  <TableHead className="text-gray-400">Entity</TableHead>
                  <TableHead className="text-gray-400">Record ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((log: any) => (
                  <TableRow
                    key={log.id}
                    className="border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-300">
                      {format(new Date(log.created_at), "MMM d, yyyy HH:mm:ss")}
                    </TableCell>
                    <TableCell className="text-gray-200">
                      {log.user
                        ? `${log.user.name} (${log.user.email})`
                        : "System"}
                    </TableCell>
                    <TableCell>
                      <Badge className={getActionBadgeColor(log.action)}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize text-blue-300">
                      {log.entity_name}
                    </TableCell>
                    <TableCell className="text-gray-400 font-mono text-sm">
                      {log.entity_id}
                    </TableCell>
                  </TableRow>
                ))}

                {data.data.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-gray-500"
                    >
                      No audit logs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
