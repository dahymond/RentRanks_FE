"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { SearchBar } from "@/components/search-bar";
import { HeroCarousel } from "@/components/hero-carousel";
import { PenLine } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Main() {
  const { data:session, status } = useSession();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" && !isRedirecting) {
      setIsRedirecting(true);
      router.push("/login");
    }
  }, [status, router, isRedirecting]);

  if (status === "loading" || (status === "unauthenticated" && isRedirecting)) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-screen">
      <Header />
      <main className="flex items-center justify-center p-8">
        <section className="">
          <div className="space-y-8">
            <div className="space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Find and Review Landlords & Tenants
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                RentRanks helps you make informed decisions with real reviews
                from real people.
              </p>
            </div>

            <SearchBar />

            <div className="relative">
              <HeroCarousel />
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Link className="" href="/submit-review">
                  <button
                    // size="lg"
                    className="flex items-center justify-center gap-2 text-lg font-medium px-8 py-2 border border-white/20 text-white shadow-lg bg-[rgb(200,81,224)]/40 hover:bg-[rgb(200,81,224)] rounded-lg"
                  >
                    <PenLine className="mr-2 h-5 w-5" />
                    Submit a Review
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
