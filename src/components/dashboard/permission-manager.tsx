"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/providers/auth-provider";
import { permissionService } from "@/services/permission.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Permission {
  id: number;
  name: string;
  slug: string;
  module: string;
  action: string;
}

interface PermissionManagerProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: number;
  targetName: string;
  targetType: "role" | "user";
  currentPermissionIds: number[];
  onSave: (permissionIds: number[]) => Promise<IResponse<unknown>>;
}

interface IResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export function PermissionManager({
  isOpen,
  onClose,
  targetName,
  targetType,
  currentPermissionIds,
  onSave,
}: PermissionManagerProps) {
  const { user: currentUser } = useAuth();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Reset selected IDs when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedIds(currentPermissionIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const { data: groupedData, isLoading } = useQuery({
    queryKey: ["permissions-grouped"],
    queryFn: () => permissionService.getGrouped(),
    enabled: isOpen,
  });

  const saveMutation = useMutation({
    mutationFn: (ids: number[]) => onSave(ids),
    onSuccess: () => {
      toast.success("Permissions updated successfully");
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update permissions");
    },
  });

  const togglePermission = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleModule = (modulePermissions: Permission[], isAll: boolean) => {
    const moduleIds = modulePermissions.map((p) => p.id);
    if (isAll) {
      setSelectedIds((prev) => [...new Set([...prev, ...moduleIds])]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => !moduleIds.includes(id)));
    }
  };

  const handleSave = () => {
    saveMutation.mutate(selectedIds);
  };

  const isPermissionAllowed = (slug: string) => {
    // Admin can do anything
    if (currentUser?.role === "admin") return true;
    return currentUser?.permissions.includes(slug);
  };

  if (!isOpen) return null;

  const groupedPermissions = (groupedData?.data || {}) as Record<
    string,
    Permission[]
  >;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col bg-card border-border text-foreground">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <DialogTitle>Manage Permissions</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Configure access for {targetType}{" "}
            <span className="text-foreground font-semibold">
              &quot;{targetName}&quot;
            </span>
            .
            {currentUser?.role !== "admin" && (
              <p className="mt-1 text-xs text-info flex items-center gap-1">
                <KeyRound className="h-3 w-3" />
                You can only grant permissions that you currently possess.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>

        <Separator className="bg-border" />

        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="space-y-8 py-4">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              Object.entries(groupedPermissions).map(
                ([module, permissions]) => {
                  const allowedInModule = permissions.filter((p) =>
                    isPermissionAllowed(p.slug),
                  );
                  const selectedInModule = permissions.filter((p) =>
                    selectedIds.includes(p.id),
                  );
                  const allSelected =
                    allowedInModule.length > 0 &&
                    allowedInModule.every((p) => selectedIds.includes(p.id));

                  return (
                    <div key={module} className="space-y-4">
                      <div className="flex items-center justify-between px-2">
                        <h3 className="text-lg font-semibold capitalize flex items-center gap-2 text-foreground">
                          {module} Module
                          <Badge
                            variant="outline"
                            className="text-xs font-normal border-border"
                          >
                            {selectedInModule.length}/{permissions.length}{" "}
                            Selected
                          </Badge>
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-primary hover:text-primary/80 hover:bg-primary/10"
                          onClick={() =>
                            toggleModule(allowedInModule, !allSelected)
                          }
                          disabled={allowedInModule.length === 0}
                        >
                          {allSelected ? "Deselect All" : "Select All"}
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-2">
                        {permissions.map((permission) => {
                          const isAllowed = isPermissionAllowed(
                            permission.slug,
                          );
                          const isSelected = selectedIds.includes(
                            permission.id,
                          );

                          return (
                            <div
                              key={permission.id}
                              className={`flex items-start space-x-3 p-3 rounded-lg border transition-all ${
                                isSelected
                                  ? "bg-primary/5 border-primary/20"
                                  : "bg-secondary/10 border-border"
                              } ${!isAllowed ? "opacity-50 cursor-not-allowed grayscale" : "cursor-pointer hover:border-primary/30"}`}
                              onClick={() =>
                                isAllowed && togglePermission(permission.id)
                              }
                            >
                              <Checkbox
                                id={`perm-${permission.id}`}
                                checked={isSelected}
                                disabled={!isAllowed}
                                onCheckedChange={() =>
                                  togglePermission(permission.id)
                                }
                                className="mt-0.5 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                              <div className="space-y-1">
                                <label
                                  htmlFor={`perm-${permission.id}`}
                                  className="text-sm font-medium leading-none cursor-pointer flex items-center gap-1.5 text-foreground"
                                >
                                  {permission.name}
                                  {!isAllowed && (
                                    <Badge
                                      variant="destructive"
                                      className="text-[10px] h-4 px-1 leading-none bg-destructive/10 text-destructive border-none"
                                    >
                                      Forbidden
                                    </Badge>
                                  )}
                                </label>
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {permission.slug}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                },
              )
            )}
          </div>
        </ScrollArea>

        <Separator className="bg-border" />

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={saveMutation.isPending}
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending || isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            {saveMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
