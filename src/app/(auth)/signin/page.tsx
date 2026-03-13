import { SigninForm } from "@/components/auth/signin-form";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "RBAC - Sign In",
  description: "Sign In to your account",
};

export default function SignInPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-background">
      {/* Background blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-info rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="absolute overflow-y-auto container px-4 mx-auto inset-0 flex flex-col">
        <div className="py-4 px-4 fixed top-0 left-0">
          <Image
            className="h-8 w-auto"
            src="/logo.png"
            alt="logo"
            width={200}
            height={200}
          />
        </div>
        <div className="w-full relative my-auto flex flex-col z-20 flex-1">
          <div className="z-10 my-auto w-full">
            <div className="mx-auto w-full max-w-md ">
              <SigninForm />
            </div>
          </div>
        </div>
        <div className="py-4 px-4 fixed top-0 bottom-0 right-0 lg:max-w-2/4">
          <Image
            className="h-full object-cover rounded-2xl w-full"
            src="/auth.png"
            alt="banner"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
}
