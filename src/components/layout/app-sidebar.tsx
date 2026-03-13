"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/providers/auth-provider";
import {
  Activity,
  BarChart3,
  Briefcase,
  Globe,
  KeyRound,
  LayoutDashboard,
  ListTodo,
  LucideIcon,
  Settings,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

type NavElement = NavItem | NavGroup;

const navItems: NavElement[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Leads",
    href: "/leads",
    icon: Briefcase,
    permission: "view_leads",
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: ListTodo,
    permission: "view_tasks",
  },
  {
    title: "Management",
    items: [
      {
        title: "Users",
        href: "/users",
        icon: Users,
        permission: "manage_users",
      },
      {
        title: "Roles",
        href: "/roles",
        icon: ShieldCheck,
        permission: "manage_roles",
      },
      {
        title: "Permissions",
        href: "/permissions",
        icon: KeyRound,
        permission: "manage_roles",
      },
    ],
  },
  {
    title: "Analysis",
    items: [
      {
        title: "Reports",
        href: "/reports",
        icon: BarChart3,
        permission: "view_reports",
      },
      {
        title: "Audit Logs",
        href: "/audit-logs",
        icon: Activity,
        permission: "view_audit_logs",
      },
    ],
  },
  {
    title: "Other",
    items: [
      {
        title: "Customer Portal",
        href: "/customer-portal",
        icon: Globe,
        permission: "access_customer_portal",
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
        permission: "manage_settings",
      },
    ],
  },
];

export function AppSidebar() {
  const { hasPermission } = useAuth();
  const pathname = usePathname();

  const renderMenuItem = (item: {
    title: string;
    href: string;
    icon: LucideIcon;
    permission?: string;
  }) => {
    if (item.permission && !hasPermission(item.permission)) return null;

    return (
      <SidebarMenuItem key={item.href}>
        <SidebarMenuButton
          asChild
          isActive={pathname.startsWith(item.href)}
          tooltip={item.title}
        >
          <Link href={item.href}>
            <item.icon />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r-0 h-full flex flex-col bg-transparent"
    >
      <SidebarHeader className="h-16 md:h-20 flex-col items-center justify-center flex px-6 border-b bg-card/10 backdrop-blur-sm">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <Image
              src="/favicon.ico"
              alt="Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="text-lg font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              RBAC Admin
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
              Enterprise Suite
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 bg-transparent flex-1 overflow-y-auto py-4">
        {navItems.map((element) => {
          if ("items" in element) {
            const hasVisibleItems = element.items.some(
              (item) => !item.permission || hasPermission(item.permission),
            );
            if (!hasVisibleItems) return null;

            return (
              <SidebarGroup key={element.title}>
                <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 px-4 py-2">
                  {element.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {element.items.map((item) => renderMenuItem(item))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          }
          return (
            <SidebarMenu key={element.href}>
              {renderMenuItem(element)}
            </SidebarMenu>
          );
        })}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
