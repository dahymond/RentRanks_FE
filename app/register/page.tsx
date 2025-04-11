"use client";

import { useState } from "react";
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
import {
  ArrowRight,
  Building,
  Lock,
  Mail,
  Shield,
  Star,
  User,
  Users,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { theme } = useTheme();
  const { push } = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "tenant", // Default role
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (
      !formData.firstName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      push("/login?registered=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="h-screen flex flex-col md:flex-row w-full">
      {/* Registration Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center h-full p-8 md:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Create your RentRanks account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Join our community of landlords and tenants
            </p>
          </div>

          <Card className="border-border/50">
            <CardContent className="pt-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        className="pl-10"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">I am a</Label>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={
                        formData.role === "tenant" ? "default" : "outline"
                      }
                      className="flex-1"
                      onClick={() =>
                        setFormData({ ...formData, role: "tenant" })
                      }
                    >
                      Tenant
                    </Button>
                    <Button
                      type="button"
                      variant={
                        formData.role === "landlord" ? "default" : "outline"
                      }
                      className="flex-1"
                      onClick={() =>
                        setFormData({ ...formData, role: "landlord" })
                      }
                    >
                      Landlord
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-destructive">{error}</div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">
                    Already have an account?{" "}
                  </span>
                  <Link href="/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Information Section - Same as login page */}
      <div className="hidden md:flex md:w-1/2 h-full bg-gradient-to-br from-[rgb(42,18,47)] to-[rgb(42,18,47)]/90 text-primary-foreground">
        <div className="w-full max-w-lg mx-auto flex flex-col justify-center p-12">
          <h2 className="text-3xl font-bold mb-6">
            Find and review the perfect match
          </h2>
          <p className="text-primary-foreground/90 mb-8">
            RentRanks helps landlords and tenants make informed decisions
            through transparent reviews and ratings.
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
                  Get detailed information about properties and rental
                  experiences.
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
                  Share experiences and learn from other renters and property
                  owners.
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
  );
}
