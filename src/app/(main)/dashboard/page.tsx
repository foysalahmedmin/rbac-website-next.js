"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/providers/auth-provider";
import {
  Activity,
  Briefcase,
  ExternalLink,
  ListTodo,
  Rocket,
  ShieldAlert,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, hasPermission } = useAuth();
  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const isCustomer = user?.role === "customer";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-linear-to-r from-primary via-primary/80 to-info bg-clip-text text-transparent">
          Welcome back, {user?.name || "User"}!
        </h1>
        <p className="text-muted-foreground font-medium">
          Here&apos;s what&apos;s happening in your {user?.role} portal today.
        </p>
      </div>

      {/* Admin/Manager States */}
      {(isAdmin || isManager) && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {hasPermission("manage_users") && (
            <Card className="bg-card/50 border-border backdrop-blur-xl shadow-sm hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">
                  Total Users
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <div className="flex items-center gap-1 text-xs text-primary mt-1 font-medium">
                  <span>+12.5%</span>
                  <span className="text-muted-foreground">from last month</span>
                </div>
              </CardContent>
            </Card>
          )}

          {hasPermission("view_leads") && (
            <Card className="bg-card/50 border-border backdrop-blur-xl shadow-sm hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">
                  Active Leads
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-info/10 flex items-center justify-center">
                  <Briefcase className="h-4 w-4 text-info" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">84</div>
                <div className="flex items-center gap-1 text-xs text-info mt-1 font-medium">
                  <span>12 new</span>
                  <span className="text-muted-foreground">leads today</span>
                </div>
              </CardContent>
            </Card>
          )}

          {hasPermission("view_tasks") && (
            <Card className="bg-card/50 border-border backdrop-blur-xl shadow-sm hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">
                  Pending Tasks
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <ListTodo className="h-4 w-4 text-success" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <div className="flex items-center gap-1 text-xs text-success mt-1 font-medium">
                  <span>5 overdue</span>
                  <span className="text-muted-foreground">actions</span>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-card/50 border-border backdrop-blur-xl shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">
                Recent Activity
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Activity className="h-4 w-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+345</div>
              <div className="flex items-center gap-1 text-xs text-destructive mt-1 font-medium">
                <span>Critical</span>
                <span className="text-muted-foreground">logs recorded</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Customer / Low Permission State */}
      {isCustomer && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-linear-to-br from-primary/5 to-info/5 border-primary/20 shadow-lg border-2">
            <CardHeader>
              <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">
                Welcome to the Platform
              </CardTitle>
              <CardDescription className="text-base">
                Your account is currently active as a <strong>Customer</strong>.
                You can explore the portal features specifically designed for
                your role.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-background/50 border border-border flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-success/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-success" />
                </div>
                <div>
                  <p className="text-sm font-bold">Self-Service Access</p>
                  <p className="text-xs text-muted-foreground">
                    You can view and manage your profile and basic settings.
                  </p>
                </div>
              </div>
              <Button
                asChild
                className="w-full h-12 rounded-xl group transition-all"
              >
                <Link href="/customer-portal">
                  Explore Customer Portal
                  <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-dashed border-2 flex flex-col items-center justify-center p-8 text-center bg-muted/30">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-6">
              <ShieldAlert className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="mb-2">Need More Access?</CardTitle>
            <CardDescription className="mb-6 max-w-[300px]">
              If you require access to Leads, Tasks, or Team Management
              features, please contact your administrator to upgrade your role.
            </CardDescription>
            <Button
              variant="outline"
              className="rounded-xl border-border bg-background"
            >
              Contact Support
            </Button>
          </Card>
        </div>
      )}

      {/* Shared Content (Charts/Logins for Admin/Manager) */}
      {(isAdmin || isManager) && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-full lg:col-span-4 bg-card/50 border-border backdrop-blur-xl shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <CardTitle className="text-lg">System Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[400px] flex items-center justify-center bg-linear-to-b from-transparent to-primary/5">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
                    Analytics Coming Soon
                  </div>
                  <p className="text-muted-foreground font-medium">
                    Real-time usage statistics will appear here.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-full lg:col-span-3 bg-card/50 border-border backdrop-blur-xl shadow-sm h-full flex flex-col">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <CardTitle className="text-lg">Recent User Access</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-6">
              <div className="space-y-6">
                {[
                  {
                    name: "Olivia Martin",
                    email: "olivia.m@email.com",
                    time: "Just now",
                    color: "bg-primary",
                  },
                  {
                    name: "Jackson Lee",
                    email: "jackson.l@email.com",
                    time: "5m ago",
                    color: "bg-info",
                  },
                  {
                    name: "Isabella Nguyen",
                    email: "isabella.n@email.com",
                    time: "2h ago",
                    color: "bg-success",
                  },
                  {
                    name: "William Kim",
                    email: "will.kim@email.com",
                    time: "5h ago",
                    color: "bg-warning",
                  },
                ].map((login, idx) => (
                  <div
                    key={idx}
                    className="flex items-center group cursor-pointer hover:bg-accent/50 p-2 rounded-lg transition-colors -mx-2"
                  >
                    <div
                      className={`h-10 w-10 rounded-full ${login.color} flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform`}
                    >
                      {login.name.charAt(0)}
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-bold leading-none">
                        {login.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {login.email}
                      </p>
                    </div>
                    <div className="ml-auto text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 bg-muted px-2 py-1 rounded-md">
                      {login.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-4 border-t border-border/50 bg-muted/10 text-center">
              <Button
                variant="ghost"
                className="text-xs font-semibold text-primary hover:text-primary hover:bg-primary/5"
              >
                View All Audit Logs
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
