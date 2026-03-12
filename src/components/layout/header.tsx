"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import React from "react";

export function Header() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter((p) => p);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b border-white/10 bg-slate-950/80 backdrop-blur-md px-6 shadow-sm">
      <div className="flex flex-1 items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/dashboard"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            {paths.map((path, index) => {
              const href = `/${paths.slice(0, index + 1).join("/")}`;
              const isLast = index === paths.length - 1;
              const title =
                path.charAt(0).toUpperCase() + path.slice(1).replace("-", " ");

              if (path === "dashboard" && index === 0) return null;

              return (
                <React.Fragment key={path}>
                  <BreadcrumbSeparator className="text-gray-600" />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="text-gray-200 font-medium">
                        {title}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href={href}
                        className="text-gray-400 hover:text-white transition-colors"
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
    </header>
  );
}
