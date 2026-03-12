"use client";

import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import {
  Activity,
  KeyRound,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  permission?: string;
}

export function Sidebar() {
  const { user, logout, hasPermission } = useAuth();
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: "Users",
      href: "/users",
      icon: <Users size={20} />,
      permission: "manage_users",
    },
    {
      title: "Roles",
      href: "/roles",
      icon: <ShieldCheck size={20} />,
      permission: "manage_roles",
    },
    {
      title: "Permissions",
      href: "/permissions",
      icon: <KeyRound size={20} />,
      permission: "manage_roles",
    },
    {
      title: "Audit Logs",
      href: "/audit-logs",
      icon: <Activity size={20} />,
      permission: "view_audit_logs",
    },
  ];

  // Filter items based on user permissions
  const filteredItems = navItems.filter(
    (item) => !item.permission || hasPermission(item.permission),
  );

  return (
    <div className="flex h-full w-64 flex-col justify-between border-r border-border bg-card/50 backdrop-blur-xl p-4 shadow-xl">
      <div className="space-y-8">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-2xl font-bold tracking-tight bg-linear-to-r from-primary to-info bg-clip-text text-transparent">
            RBAC System
          </h2>
          <div className="space-y-1 mt-6">
            {filteredItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                    pathname.startsWith(item.href)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "mr-3 transition-colors",
                      pathname.startsWith(item.href)
                        ? "text-primary"
                        : "text-muted-foreground/50 group-hover:text-primary/70",
                    )}
                  >
                    {item.icon}
                  </span>
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="px-3 py-4 border-t border-border space-y-4">
        {user && (
          <div className="px-4 py-3 rounded-lg bg-secondary/20 border border-border">
            <p className="text-sm font-medium text-foreground break-all">
              {user.name}
            </p>
            <p className="text-xs text-muted-foreground">{user.role}</p>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="mr-3" size={20} />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
