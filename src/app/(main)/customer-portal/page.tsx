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
  FileText,
  HelpCircle,
  MessageSquare,
  Package,
  Star,
} from "lucide-react";

export default function CustomerPortalPage() {
  const { user } = useAuth();

  const services = [
    {
      title: "My Subscriptions",
      description: "Manage your active plans and billing cycles.",
      icon: <Package className="h-6 w-6 text-primary" />,
      badge: "Active",
    },
    {
      title: "Billing & Invoices",
      description: "View and download your past payment receipts.",
      icon: <CreditCard className="h-6 w-6 text-primary" />,
    },
    {
      title: "Support Tickets",
      description: "Get help from our technical support team.",
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      badge: "2 Open",
    },
    {
      title: "Service Status",
      description: "Check the real-time health of our platforms.",
      icon: <Star className="h-6 w-6 text-primary" />,
      badge: "Operational",
    },
    {
      title: "Documentation",
      description: "Read our comprehensive guides and API docs.",
      icon: <FileText className="h-6 w-6 text-primary" />,
    },
    {
      title: "Help Center",
      description: "Search our knowledge base for quick answers.",
      icon: <HelpCircle className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {user?.name.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground">
          Access all your services and manage your subscription from your
          personalized portal.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <Card
            key={index}
            className="bg-card/50 border-border hover:border-primary/50 transition-all hover:shadow-lg group"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                {service.icon}
              </div>
              {service.badge && (
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  {service.badge}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="mt-4">
              <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                {service.title}
              </CardTitle>
              <CardDescription className="mt-2 text-muted-foreground">
                {service.description}
              </CardDescription>
              <Button
                variant="link"
                className="px-0 mt-4 text-primary hover:text-primary/80 p-0"
              >
                Explore now →
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-linear-to-r from-primary/10 via-info/10 to-primary/10 border-border">
        <CardContent className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-bold text-foreground">
                Need dedicated help?
              </h3>
              <p className="text-muted-foreground">
                Our priority support team is available 24/7 for Enterprise
                customers.
              </p>
            </div>
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
