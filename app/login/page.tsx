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
import Link from "next/link";
import { ArrowRight, Building, Shield, Star, Users } from "lucide-react";

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
    <div className="min-h-screen flex flex-col md:flex-row w-full">
      {/* Login Form Section */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center p-8 md:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            {/* <div className="flex justify-center mb-6">
              <Image src="/placeholder.svg?height=60&width=180" alt="RentRanks Logo" width={180} height={60} priority />
            </div> */}
            <h1 className="text-2xl font-bold tracking-tight">Welcome to RentRanks</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to rate and review landlords and tenants</p>
          </div>

          <Card className="border-border/50">
            <CardContent className="pt-6 pb-6 space-y-4">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 h-12 relative overflow-hidden group"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 group-hover:w-full transition-all duration-500 ease-out"></div>
                <svg
                  className="h-5 w-5 relative z-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                    fill="#FFC107"
                  />
                  <path
                    d="M3.15302 7.3455L6.43852 9.755C7.32752 7.554 9.48052 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15902 2 4.82802 4.1685 3.15302 7.3455Z"
                    fill="#FF3D00"
                  />
                  <path
                    d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5718 17.5742 13.3038 18.001 12 18C9.39897 18 7.19047 16.3415 6.35847 14.027L3.09747 16.5395C4.75247 19.778 8.11347 22 12 22Z"
                    fill="#4CAF50"
                  />
                  <path
                    d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                    fill="#1976D2"
                  />
                </svg>
                <span className="relative z-10">Continue with Google</span>
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 h-12 relative overflow-hidden group"
                onClick={handleFacebookLogin}
                disabled={isLoading}
              >
                <div className="absolute inset-0 w-3 bg-gradient-to-r from-[#1877F2]/80 via-[#1877F2]/40 to-transparent opacity-0 group-hover:opacity-100 group-hover:w-full transition-all duration-500 ease-out"></div>
                <svg
                  className="h-5 w-5 text-[#1877F2] relative z-10"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
                </svg>
                <span className="relative z-10">Continue with Facebook</span>
              </Button>

              <div className="relative flex items-center justify-center mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50"></div>
                </div>
                <div className="relative px-4 text-sm bg-background text-muted-foreground">Or continue as guest</div>
              </div>

              <Link href="/" className="block w-full">
                <Button variant="ghost" className="w-full mt-2 text-muted-foreground hover:text-foreground">
                  Browse without signing in
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Information Section - Only visible on md screens and up */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[rgb(42,18,47)] to-[rgb(42,18,47)]/90 text-primary-foreground">
        <div className="w-full max-w-lg mx-auto flex flex-col justify-center p-12">
          <h2 className="text-3xl font-bold mb-6">Find and review the perfect match</h2>
          <p className="text-primary-foreground/90 mb-8">
            RentRanks helps landlords and tenants make informed decisions through transparent reviews and ratings.
          </p>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-white/10 p-3 rounded-full">
                <Star className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Honest Reviews</h3>
                <p className="text-sm text-primary-foreground/80">
                  Read and write authentic reviews about landlords and tenants.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white/10 p-3 rounded-full">
                <Building className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Property Insights</h3>
                <p className="text-sm text-primary-foreground/80">
                  Get detailed information about properties and rental experiences.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white/10 p-3 rounded-full">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Trusted Community</h3>
                <p className="text-sm text-primary-foreground/80">
                  Join a community dedicated to improving rental experiences.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Connect with Others</h3>
                <p className="text-sm text-primary-foreground/80">
                  Share experiences and learn from other renters and property owners.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/20">
            <Link
              href="/about"
              className="group inline-flex items-center text-primary-foreground hover:text-accent transition-colors"
            >
              Learn more about RentRanks
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
