import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RBAC - Main",
  description: "Main",
};

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { DynamicBreadcrumbs } from "@/components/layout/dynamic-breadcrumbs";
import { Header } from "@/components/layout/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full bg-primary/25 text-foreground">
          <AppSidebar />
          <SidebarInset className="relative h-full flex flex-col flex-1 overflow-hidden transition-all duration-300">
            <Header />
            <main className="flex-1 overflow-y-auto">
              <div className="mx-auto max-w-screen-2xl p-6 md:p-8 lg:p-10">
                <DynamicBreadcrumbs />
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {children}
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
