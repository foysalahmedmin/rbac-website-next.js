"use client";

import { useAuth } from "@/providers/auth-provider";
import { ReactNode } from "react";

interface AccessWrapperProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function AccessWrapper({
  permission,
  children,
  fallback = null,
}: AccessWrapperProps) {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
