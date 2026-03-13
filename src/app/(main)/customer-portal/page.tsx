"use client";

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
  CreditCard,
  ExternalLink,
  FileText,
  Gem,
  HelpCircle,
  LifeBuoy,
  MessageSquare,
  Package,
  Stars,
} from "lucide-react";

export default function CustomerPortalPage() {
  const { user } = useAuth();

  const services = [
    {
      title: "My Subscriptions",
      description: "Manage your active plans, usage limits and billing cycles.",
      icon: <Package className="h-6 w-6" />,
      badge: "Active",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Billing & Invoices",
      description: "Securely view and download your past payment receipts.",
      icon: <CreditCard className="h-6 w-6" />,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Support Tickets",
      description:
        "Direct line to our technical assistants for rapid resolution.",
      icon: <MessageSquare className="h-6 w-6" />,
      badge: "2 Priority",
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      title: "Exclusive Perks",
      description: "Access curated discounts and beta features for your tier.",
      icon: <Gem className="h-6 w-6" />,
      badge: "Premium",
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      title: "Knowledge Hub",
      description: "In-depth guides, API reference and implementation docs.",
      icon: <FileText className="h-6 w-6" />,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "General Inquiries",
      description: "Search our FAQ or start a conversation with our concierge.",
      icon: <HelpCircle className="h-6 w-6" />,
      color: "text-pink-500",
      bg: "bg-pink-500/10",
    },
  ];

  return (
    <div className="space-y-12 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-primary/10 via-background to-info/5 border border-primary/10 p-8 md:p-12">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
              <Stars size={12} fill="currentColor" />
              Customer Dashboard
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-[1.1]">
              Welcome, <br className="hidden md:block" />
              <span className="bg-linear-to-r from-primary to-info bg-clip-text text-transparent">
                {user?.name || "Guest"}
              </span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium max-w-md">
              Your personalized command center for all your enterprise services
              and subscriptions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-background/50 border border-border backdrop-blur-md shadow-sm">
              <p className="text-3xl font-black tracking-tighter">Pro</p>
              <p className="text-xs font-bold text-muted-foreground uppercase mt-1">
                Current Tier
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-primary text-primary-foreground shadow-xl shadow-primary/20">
              <p className="text-3xl font-black tracking-tighter">Active</p>
              <p className="text-xs font-bold text-primary-foreground/70 uppercase mt-1">
                Status
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <Card
            key={index}
            className="group relative bg-card/40 border-border/50 hover:border-primary/40 transition-all duration-500 rounded-[2rem] shadow-sm hover:shadow-2xl overflow-hidden hover:-translate-y-2 ring-1 ring-border/5"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div
                className={`p-4 rounded-2xl ${service.bg} ${service.color} transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
              >
                {service.icon}
              </div>
              {service.badge && (
                <Badge className="bg-primary/5 text-primary border-primary/20 font-black text-[10px] uppercase px-3 rounded-full">
                  {service.badge}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="mt-4 px-6 pb-8">
              <CardTitle className="text-xl font-black tracking-tight group-hover:text-primary transition-colors">
                {service.title}
              </CardTitle>
              <CardDescription className="mt-3 text-muted-foreground font-medium leading-relaxed">
                {service.description}
              </CardDescription>
              <Button
                variant="ghost"
                className="mt-6 px-0 text-primary font-bold hover:bg-transparent hover:text-primary/70 h-auto gap-2 group/btn"
              >
                Access Service
                <ExternalLink className="h-4 w-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="relative overflow-hidden bg-linear-to-r from-primary to-info rounded-[3rem] border-none shadow-2xl shadow-primary/20">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />
        <CardContent className="relative py-12 px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <LifeBuoy className="animate-spin-slow" size={24} />
                </div>
                <h3 className="text-3xl font-black text-white tracking-tight">
                  Priority Support Vault
                </h3>
              </div>
              <p className="text-white/80 font-medium max-w-xl text-lg">
                Our elite technical assistance unit is standing by 24/7/365 to
                ensure your mission-critical operations remain flawless.
              </p>
            </div>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 rounded-2xl h-16 px-8 text-lg font-black shadow-xl"
            >
              Contact My Concierge
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
