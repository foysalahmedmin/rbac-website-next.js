import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RBAC - Authentication",
  description: "Authentication",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main>{children}</main>;
}
