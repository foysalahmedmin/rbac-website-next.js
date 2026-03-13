"use client";

import { ModeToggle } from "@/components/common/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/providers/auth-provider";
import { Bell, LogOut, Search, Settings, User } from "lucide-react";
import Link from "next/link";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-16 md:h-20 w-full items-center border-b border-border bg-background/60 backdrop-blur-xl px-4 md:px-6 shadow-xs transition-all duration-300">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-10 w-10 hover:bg-accent transition-colors" />
          <div className="hidden md:flex relative w-64 lg:w-96 group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="search"
              placeholder="Search anything..."
              className="w-full pl-10 pr-4 bg-accent/30 border-transparent focus:bg-background focus:border-primary/30 transition-all rounded-xl h-10 shadow-inner"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex relative h-10 w-10 rounded-xl hover:bg-accent transition-colors"
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-destructive animate-pulse ring-2 ring-background ring-offset-0" />
          </Button>

          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-11 w-fit flex items-center gap-2 pl-1 pr-3 rounded-full hover:bg-accent border border-transparent hover:border-border transition-all"
              >
                <Avatar className="h-9 w-9 border border-primary/20 shadow-sm transition-transform hover:scale-105">
                  <AvatarImage
                    src={`https://avatar.iran.liara.run/public/${user?.id || 1}`}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:flex flex-col items-start leading-none text-left">
                  <span className="text-sm font-semibold truncate max-w-[120px]">
                    {user?.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-tight">
                    {user?.role}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 rounded-xl p-2" align="end">
              <DropdownMenuLabel className="font-normal p-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold leading-none">{user?.name}</p>
                  <p className="text-xs text-muted-foreground leading-none mt-1">
                    {user?.email}
                  </p>
                  <div className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {user?.role}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="mx-2" />
              <DropdownMenuGroup>
                <Link href="/profile">
                  <DropdownMenuItem className="rounded-lg h-10 cursor-pointer">
                    <User className="mr-3 h-4 w-4 text-muted-foreground" />
                    <span>Account Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/settings">
                  <DropdownMenuItem className="rounded-lg h-10 cursor-pointer">
                    <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
                    <span>General Settings</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="mx-2" />
              <DropdownMenuItem
                onClick={logout}
                className="rounded-lg h-10 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span>Sign out session</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
