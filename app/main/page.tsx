"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { SearchBar } from "@/components/search-bar"
import { HeroCarousel } from "@/components/hero-carousel"
import { Button } from "@/components/ui/button"
import { PenLine } from "lucide-react"
import { useSession } from "next-auth/react"

export default function Main() {
  const {data} = useSession()

  // console.log(data)
  
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
                RentRanks helps you make informed decisions with real reviews from real people.
              </p>
            </div>

            <SearchBar />

            <div className="relative">
              <HeroCarousel />
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Link href="/submit-review">
                  <Button size="lg" className="text-lg font-medium px-5 py-6">
                    <PenLine className="mr-2 h-5 w-5" />
                    Submit a Review
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}