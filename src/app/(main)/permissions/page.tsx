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

interface Permission {
  id: number;
  name: string;
  slug: string;
  module: string;
  action: string;
}

export default function PermissionsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["permissions-grouped"],
    queryFn: () => permissionService.getGrouped(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return <div className="text-destructive">Failed to load permissions</div>;
  }

  const groupedPermissions = (data.data || {}) as Record<string, Permission[]>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Permissions
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(groupedPermissions).map(([resource, permissions]) => (
          <Card
            key={resource}
            className="bg-card border-border backdrop-blur-xl"
          >
            <CardHeader className="flex flex-row items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              <CardTitle className="text-card-foreground capitalize">
                {resource} Module
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground">
                        Action
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Permission Slug
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.map((permission) => (
                      <TableRow
                        key={permission.id}
                        className="border-border hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="font-medium text-foreground capitalize">
                          {permission.action}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-secondary text-secondary-foreground"
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
