"use client";

import { useAuth } from "@/providers/auth-provider";
import { ReactNode } from "react";

interface AccessWrapperProps {
  children: ReactNode;
  permission?: string;
  role?: string | string[];
  fallback?: ReactNode;
}

export function AccessWrapper({
  children,
  permission,
  role,
  fallback = null,
}: AccessWrapperProps) {
  const { hasPermission, user } = useAuth();

  let hasAccess = true;

  if (permission && !hasPermission(permission)) {
    hasAccess = false;
  }

  if (role) {
    const roles = Array.isArray(role) ? role : [role];
    if (user && !roles.includes(user.role)) {
      hasAccess = false;
    }
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
