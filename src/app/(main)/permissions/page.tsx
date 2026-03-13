"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { KeyRound, Loader2, Lock, ShieldCheck, Tag, Zap } from "lucide-react";

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
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <Loader2 className="h-12 w-12 animate-spin text-primary/30" />
        <p className="mt-4 text-[10px] font-black tracking-widest uppercase text-muted-foreground">
          Initializing Registry...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-20 text-center space-y-4">
        <Lock className="h-12 w-12 text-destructive/40 mx-auto" />
        <p className="text-destructive font-black text-xl">
          Authorization Vault Locked
        </p>
        <p className="text-muted-foreground text-sm">
          Failed to retrieve the granular permission matrix.
        </p>
      </div>
    );
  }

  const groupedPermissions = (data.data || {}) as Record<string, Permission[]>;

  return (
    <div className="space-y-10 animate-in fade-in zoom-in-95 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter text-foreground flex items-center gap-3">
            <ShieldCheck className="text-primary h-8 w-8" />
            Permission Matrix
          </h1>
          <p className="text-muted-foreground text-sm font-semibold italic">
            Review the core atomic authorizations that power the RBAC engine.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-4 bg-muted/30 p-2 rounded-2xl border border-border/50">
          <div className="flex items-center gap-2 px-3 py-1 bg-background rounded-xl shadow-xs border border-border/50">
            <Zap size={14} className="text-warning fill-warning" />
            <span className="text-xs font-black tracking-tighter uppercase">
              {Object.keys(groupedPermissions).length} Modules
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-background rounded-xl shadow-xs border border-border/50">
            <Tag size={14} className="text-primary fill-primary/20" />
            <span className="text-xs font-black tracking-tighter uppercase">
              {Object.values(groupedPermissions).flat().length} Total Slugs
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(groupedPermissions).map(([resource, permissions]) => (
          <Card
            key={resource}
            className="bg-card/40 border-border/50 backdrop-blur-3xl shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl group overflow-hidden border-t-0 ring-1 ring-border/20"
          >
            <CardHeader className="flex flex-row items-center gap-3 bg-muted/20 border-b border-border/40 py-5">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                <KeyRound size={20} />
              </div>
              <div>
                <CardTitle className="text-lg font-black capitalize tracking-tight">
                  {resource}
                </CardTitle>
                <CardDescription className="text-[10px] font-black uppercase tracking-widest opacity-60">
                  System Module
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/5 pointer-events-none">
                  <TableRow className="border-border/30 hover:bg-transparent">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground py-3 pl-6">
                      Function
                    </TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground py-3 pr-6 text-right">
                      Identifier
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((permission) => (
                    <TableRow
                      key={permission.id}
                      className="border-border/20 hover:bg-primary/5 transition-all duration-300"
                    >
                      <TableCell className="py-4 pl-6">
                        <span className="text-xs font-bold text-foreground/80 capitalize">
                          {permission.action.replace("_", " ")}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 pr-6 text-right">
                        <Badge
                          variant="secondary"
                          className="bg-muted/50 text-[10px] lowercase font-mono font-black border-none px-2 rounded-md group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                        >
                          {permission.name}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <div className="h-1.5 bg-linear-to-r from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </Card>
        ))}
      </div>
    </div>
  );
}
