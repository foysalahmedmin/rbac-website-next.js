"use client";

import { authService } from "@/services/auth.service";
import { IAuthUser } from "@/types/user.type";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: IAuthUser | null;
  isLoading: boolean;
  login: (token: string, user: IAuthUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { setAccessToken } from "@/lib/api";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IAuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = getCookie("access_token") as string | undefined;

        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
          setAccessToken(token);
        }

        // Try to get a fresh access token using the refresh token cookie
        const response = await authService.refreshToken();
        if (response.success) {
          setAccessToken(response.data.access_token);
          setCookie("access_token", response.data.access_token, {
            maxAge: 60 * 60 * 24 * 7, // 7 days expiration for app client (example)
            path: "/",
          });
          setUser(response.data.info);
          localStorage.setItem("user", JSON.stringify(response.data.info));
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        // Clean up invalid state
        deleteCookie("access_token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (token: string, user: IAuthUser) => {
    setAccessToken(token);
    setCookie("access_token", token, {
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    router.push("/dashboard");
  };

  const logout = () => {
    setAccessToken(null);
    deleteCookie("access_token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/signin");
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    if (user.role === "admin") return true;
    return user?.permissions?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
