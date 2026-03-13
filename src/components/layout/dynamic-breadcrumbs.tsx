"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

export function DynamicBreadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter((p) => p);

  if (paths.length === 0) return null;

  return (
    <div className="mb-6">
      <Breadcrumb>
        <BreadcrumbList className="flex items-center gap-2">
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/dashboard"
              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {paths.map((path, index) => {
            const href = `/${paths.slice(0, index + 1).join("/")}`;
            const isLast = index === paths.length - 1;
            const title = path
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");

            if (path === "dashboard" && index === 0) return null;

            return (
              <React.Fragment key={path}>
                <BreadcrumbSeparator className="text-muted-foreground/50">
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="text-foreground font-semibold px-2 py-1 rounded-md bg-accent/50 border border-border/50 shadow-xs">
                      {title}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href={href}
                      className="text-muted-foreground hover:text-primary transition-colors font-medium"
                    >
                      {title}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
