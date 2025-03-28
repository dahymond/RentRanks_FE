"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "@/components/header";
import { useTheme } from "next-themes";

export default function LoginPage() {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // await signIn("google", { callbackUrl: "/search" });
    await signIn("google", { callbackUrl: "/main" });
  };

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    await signIn("facebook", { callbackUrl: "/main" });
  };

  return (
    <div className="relative flex flex-col min-h-screen items-center justify-center bg-background px-4">
      <Header />
      <main className="flex items-center h-full justify-center py-8">
        <Card className="w-full space-y-10 max-w-md min-h-[400px]">
          <CardHeader className="text-center">
            {/* <div className="flex justify-center mb-4">
              <Image
                src={`${
                  theme === "light"
                    ? "logos/default-monochrome-black.svg"
                    : "logos/default-monochrome-white.svg"
                }`}
                alt="RentRanks Logo"
                width={250}
                height={250}
                priority
              />
            </div> */}
            <CardTitle className="text-2xl mb-3">Welcome to Rent Ranks</CardTitle>
            <CardDescription>
              Sign in to rate and review landlords and tenants
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 h-12"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-google"
              >
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                <path d="M12 16V8" />
                <path d="M8 12h8" />
              </svg>
              Login with Google
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 h-12"
              onClick={handleFacebookLogin}
              disabled={isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-facebook"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              Login with Facebook
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
