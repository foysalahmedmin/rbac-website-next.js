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

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SigninValues = z.infer<typeof signinSchema>;

export function SigninForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const form = useForm<SigninValues>({
    resolver: zodResolver(signinSchema as any),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SigninValues) {
    setIsLoading(true);
    try {
      const response = await authService.login(values);
      if (response.success) {
        toast.success("Login successful!");
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
        <CardTitle className="text-3xl font-bold tracking-tight text-center bg-linear-to-r from-primary to-info bg-clip-text text-transparent">
          Sign In
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Enter your email and password to access your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              disabled={isLoading}
              className="bg-secondary/10 border-border text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 transition-all"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-400">
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
              className="bg-secondary/10 border-border text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 transition-all"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-400">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
