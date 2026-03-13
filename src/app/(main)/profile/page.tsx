"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  ArrowRight,
  Calendar,
  Fingerprint,
  Mail,
  Settings,
  Shield,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();

  // For demo purposes, we'll use a fallback date if created_at isn't real
  const joinedDate =
    user && "created_at" in user && user.created_at
      ? new Date(user.created_at as string).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : "March 2024";

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Profile Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-primary/10 via-background to-secondary/5 border border-border/50 p-8 md:p-12 shadow-sm">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-linear-to-tr from-primary to-info opacity-40 blur-sm group-hover:opacity-100 transition duration-500" />
            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-2xl relative">
              <AvatarImage
                src={`https://avatar.iran.liara.run/public/${user?.id || 0}`}
              />
              <AvatarFallback className="bg-muted text-4xl font-black text-primary">
                {user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-success border-4 border-background shadow-lg shadow-success/20 animate-pulse" />
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-2 border border-primary/20">
                <Fingerprint size={12} />
                Verified Identity
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-tight">
                {user?.name}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-muted-foreground font-medium mt-2">
                <div className="flex items-center gap-1.5">
                  <Mail size={16} className="text-primary/60" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                <div className="flex items-center gap-1.5 border-l border-border/50 pl-4">
                  <Calendar size={16} className="text-primary/60" />
                  <span className="text-sm italic">Joined {joinedDate}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
              <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-4 py-1.5 rounded-xl uppercase tracking-tighter text-xs shadow-lg shadow-primary/20">
                {user?.role} Role
              </Badge>
              <Badge
                variant="outline"
                className="border-border bg-background/50 font-bold px-4 py-1.5 rounded-xl text-xs backdrop-blur-sm"
              >
                Status: Active
              </Badge>
            </div>
          </div>

          <div className="flex flex-col gap-3 shrink-0 self-center">
            <Button
              asChild
              variant="outline"
              className="rounded-2xl h-12 px-6 border-border hover:bg-muted font-bold transition-all hover:scale-105 active:scale-95"
            >
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Edit Account
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="rounded-2xl h-12 px-6 border border-transparent hover:border-border font-bold text-muted-foreground transition-all"
            >
              Change Identity
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Account Details Card */}
        <Card className="bg-card/40 border-border/50 backdrop-blur-3xl shadow-2xl rounded-[2rem] overflow-hidden ring-1 ring-border/5">
          <CardHeader className="bg-muted/10 border-b border-border/40 px-8 py-6">
            <CardTitle className="text-xl font-black flex items-center gap-2">
              <User size={20} className="text-primary" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {[
              {
                label: "Internal ID",
                value: `#${user?.id || "---"}`,
                icon: Shield,
              },
              { label: "Primary Email", value: user?.email, icon: Mail },
              { label: "Account Tier", value: user?.role, icon: ShieldCheck },
              {
                label: "System Status",
                value: "Fully Operational",
                icon: ShieldCheck,
                color: "text-success",
              },
            ].map((item, i) => (
              <div key={i} className="group cursor-default">
                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60 flex items-center gap-2 mb-1.5">
                  <item.icon
                    size={10}
                    className="group-hover:text-primary transition-colors"
                  />
                  {item.label}
                </p>
                <p
                  className={`text-sm font-bold truncate ${item.color || "text-foreground"}`}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Permissions Matrix Card */}
        <Card className="lg:col-span-2 bg-card/40 border-border/50 backdrop-blur-3xl shadow-2xl rounded-[2rem] overflow-hidden ring-1 ring-border/5">
          <CardHeader className="bg-muted/10 border-b border-border/40 px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <ShieldCheck size={20} className="text-success" />
                  Privilege Matrix
                </CardTitle>
                <CardDescription className="text-xs font-medium">
                  Atomic authorizations assigned to your identity package.
                </CardDescription>
              </div>
              <Badge className="bg-success/10 text-success border-success/20 font-black">
                {user?.permissions?.length || 0} ACTIVE
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {user?.permissions?.map((permission, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-3 rounded-2xl bg-background/50 border border-border/50 shadow-inner group hover:border-success/30 hover:bg-success/5 transition-all"
                >
                  <div className="h-2 w-2 rounded-full bg-success opacity-40 group-hover:opacity-100 transition-opacity" />
                  <span className="text-xs font-black tracking-tight text-foreground/80 truncate lowercase">
                    {permission.replace(/_/g, " ")}
                  </span>
                </div>
              ))}
              {(!user?.permissions || user.permissions.length === 0) && (
                <div className="col-span-full py-12 text-center space-y-3 opacity-50">
                  <Shield size={40} className="mx-auto text-muted-foreground" />
                  <p className="text-sm font-bold">
                    No active permissions detected.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-border/40">
              <div className="p-6 rounded-3xl bg-linear-to-r from-primary/5 to-info/5 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center md:text-left">
                  <p className="text-sm font-black tracking-tight">
                    Need expanded access?
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    Coordinate with system architects to upgrade your security
                    tier.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-primary/20 bg-background text-primary font-bold shadow-sm group"
                >
                  Request Upgrade
                  <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
