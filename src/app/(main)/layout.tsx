import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RBAC - Main",
  description: "Main",
};

import { ProtectedRoute } from "@/components/auth/protected-route";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-50">
        <Sidebar aria-hidden="false" />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header aria-hidden="false" />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
