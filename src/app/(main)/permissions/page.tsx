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
import { permissionService } from "@/services/permission.service";
import { useQuery } from "@tanstack/react-query";
import { KeyRound, Loader2 } from "lucide-react";

export default function PermissionsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["permissions-grouped"],
    queryFn: () => permissionService.getGrouped(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !data) {
    return <div className="text-red-400">Failed to load permissions</div>;
  }

  const groupedPermissions: Record<string, any[]> = data.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Permissions
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(groupedPermissions).map(([resource, permissions]) => (
          <Card
            key={resource}
            className="bg-white/5 border-white/10 backdrop-blur-xl"
          >
            <CardHeader className="flex flex-row items-center gap-2">
              <KeyRound className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-gray-200 capitalize">
                {resource} Module
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-white/10">
                <Table>
                  <TableHeader className="bg-black/20 hover:bg-black/20">
                    <TableRow className="border-white/10">
                      <TableHead className="text-gray-400">Action</TableHead>
                      <TableHead className="text-gray-400">
                        Permission Name
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.map((permission) => (
                      <TableRow
                        key={permission.id}
                        className="border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <TableCell className="font-medium text-gray-200 capitalize">
                          {permission.action}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="text-blue-400 border-blue-400/30"
                          >
                            {permission.name}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
