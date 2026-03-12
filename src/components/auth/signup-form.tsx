"use client";

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
import { useAuth } from "@/providers/auth-provider";
import { authService } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema as any),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignupValues) {
    setIsLoading(true);
    try {
      const response = await authService.register(values);
      if (response.success) {
        toast.success("Account created successfully!");
        login(response.data.access_token, response.data.info);
      }
    } catch (error: unknown) {
      toast.error((error as Error).message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md border-border bg-card/10 backdrop-blur-xl text-foreground shadow-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold tracking-tight text-center bg-linear-to-r from-success to-info bg-clip-text text-transparent">
          Create Account
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Join our RBAC system today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="John Doe"
              type="text"
              disabled={isLoading}
              className="bg-secondary/10 border-border text-foreground placeholder:text-muted-foreground/50 focus:border-success/50 transition-all"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              disabled={isLoading}
              className="bg-secondary/10 border-border text-foreground placeholder:text-muted-foreground/50 focus:border-success/50 transition-all"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              disabled={isLoading}
              className="bg-secondary/10 border-border text-foreground placeholder:text-muted-foreground/50 focus:border-success/50 transition-all"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          <Button
            className="w-full bg-success hover:bg-success/90 text-success-foreground font-semibold py-6 shadow-lg shadow-success/20 transition-all active:scale-[0.98]"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-success hover:text-success/80 font-medium underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
