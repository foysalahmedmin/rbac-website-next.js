"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/providers/auth-provider";
import {
  Bell,
  Fingerprint,
  Info,
  Loader2,
  Lock,
  Save,
  Settings,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuth();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setTimeout(() => {
      setProfileLoading(false);
      toast.success("Identity profile synchronized.");
    }, 1500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setTimeout(() => {
      setPasswordLoading(false);
      toast.success("Security credentials rotated.");
    }, 1500);
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-border/50">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest border border-primary/20 bg-primary/5 px-2 py-0.5 rounded-md w-fit mb-2">
            <Settings size={12} className="animate-spin-slow" />
            Core Configuration
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground">
            Account Control
          </h1>
          <p className="text-muted-foreground font-medium italic">
            Optimize your workspace environment and security protocols.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-muted/20 p-2 rounded-2xl border border-border/40">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarImage
              src={`https://avatar.iran.liara.run/public/${user?.id || 0}`}
            />
            <AvatarFallback className="bg-primary/5 text-primary">
              {user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="pr-4">
            <p className="text-xs font-black leading-none">{user?.name}</p>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter italic">
              Tier: {user?.role}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="bg-muted/30 p-1.5 border border-border/50 rounded-2xl h-14 w-full md:w-fit backdrop-blur-md">
          <TabsTrigger
            value="profile"
            className="rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all font-bold gap-2"
          >
            <UserIcon size={16} />
            Identity
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all font-bold gap-2"
          >
            <Lock size={16} />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all font-bold gap-2"
          >
            <Bell size={16} />
            Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="profile"
          className="space-y-6 animate-in slide-in-from-left-4 duration-500"
        >
          <Card className="bg-card/40 border-border/50 backdrop-blur-3xl shadow-2xl rounded-3xl overflow-hidden ring-1 ring-border/20">
            <CardHeader className="bg-muted/10 border-b border-border/40 px-8 py-6">
              <CardTitle className="text-xl font-black flex items-center gap-2">
                <Fingerprint className="text-primary" size={20} />
                Identity Mapping
              </CardTitle>
              <CardDescription className="text-xs font-medium">
                Configure how the system identifies and presents you.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                    >
                      Full Legal Name
                    </Label>
                    <Input
                      id="name"
                      defaultValue={user?.name}
                      placeholder="e.g. Alexander Pierce"
                      className="h-12 bg-background/50 border-border/50 focus:ring-4 focus:ring-primary/5 rounded-xl font-bold transition-all"
                    />
                  </div>
                  <div className="space-y-2 group">
                    <Label
                      htmlFor="email"
                      className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1"
                    >
                      Authentication Email
                      <Info
                        size={12}
                        className="opacity-40 group-hover:opacity-100 transition-opacity"
                      />
                    </Label>
                    <Input
                      id="email"
                      defaultValue={user?.email}
                      disabled
                      className="h-12 bg-muted/30 border-dashed border-border/50 font-bold opacity-60 rounded-xl cursor-not-allowed italic"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 transition-all font-black"
                    disabled={profileLoading}
                  >
                    {profileLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Sync Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="security"
          className="space-y-6 animate-in slide-in-from-right-4 duration-500"
        >
          <Card className="bg-card/40 border-border/50 backdrop-blur-3xl shadow-2xl rounded-3xl overflow-hidden ring-1 ring-border/20">
            <CardHeader className="bg-destructive/5 border-b border-border/40 px-8 py-6">
              <CardTitle className="text-xl font-black flex items-center gap-2">
                <ShieldCheck className="text-destructive" size={20} />
                Access Credentials
              </CardTitle>
              <CardDescription className="text-xs font-medium">
                Update your digital signature and security keys.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleChangePassword} className="space-y-8">
                <div className="space-y-6 max-w-xl">
                  <div className="space-y-2">
                    <Label
                      htmlFor="current"
                      className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                    >
                      Current Passcode
                    </Label>
                    <Input
                      id="current"
                      type="password"
                      placeholder="••••••••"
                      className="h-12 bg-background/50 border-border/50 focus:ring-4 focus:ring-primary/5 rounded-xl font-bold transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="new"
                        className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                      >
                        New Passphrase
                      </Label>
                      <Input
                        id="new"
                        type="password"
                        placeholder="••••••••"
                        className="h-12 bg-background/50 border-border/50 focus:ring-4 focus:ring-primary/5 rounded-xl font-bold transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="confirm"
                        className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                      >
                        Re-type New
                      </Label>
                      <Input
                        id="confirm"
                        type="password"
                        placeholder="••••••••"
                        className="h-12 bg-background/50 border-border/50 focus:ring-4 focus:ring-primary/5 rounded-xl font-bold transition-all"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-start">
                  <Button
                    type="submit"
                    className="h-12 px-8 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-xl shadow-destructive/20 transition-all font-black"
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Lock className="mr-2 h-4 w-4" />
                    )}
                    Rotate Credentials
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="notifications"
          className="animate-in zoom-in-95 duration-500"
        >
          <Card className="bg-muted/10 border-dashed border-2 border-border/40 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Bell size={32} />
            </div>
            <h3 className="text-xl font-black">Alert Hub Coming Soon</h3>
            <p className="text-muted-foreground max-w-xs text-sm font-medium">
              Configure push, email and SMS notifications for system-wide events
              and role-based actions.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
