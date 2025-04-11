"use client"
import Link from "next/link"
import { Header } from "@/components/header"
import { SearchBar } from "@/components/search-bar"
import { StarRating } from "@/components/star-rating"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

interface SearchResult {
  id: string
  name: string
  type: string
  rating: number
  reviewCount: number
  location: string
  lastReviewDate?: string
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { data: session } = useSession()
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const type = (searchParams.type as string) || "tenant"
  const name = (searchParams.name as string) || ""
  const location = (searchParams.location as string) || ""

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const params = new URLSearchParams()
        if (type) params.set('type', type)
        if (name) params.set('name', name)
        if (location) params.set('location', location)

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/profiles/search/?${params.toString()}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.djangoJwt}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error("Failed to fetch search results")
        }

        const data = await response.json()
        setResults(data.results)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed")
      } finally {
        setLoading(false)
      }
    }

    if (name && session?.user) {
      fetchResults()
    } else {
      setResults([])
      setLoading(false)
    }
  }, [type, name, location, session])

  return (
    <div className="min-h-screen flex flex-col items-center w-screen">
      <Header />
      <main className="flex flex-col items-center py-8 p-10 w-full">
        <div className="w-full mb-8">
          <SearchBar />
        </div>

        <div className="flex flex-col items-center justify-center w-full gap-10">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-3xl font-bold">{type === "landlord" ? "Landlord" : "Tenant"} Search Results</h1>
            {!loading && (
              <p className="text-muted-foreground">
                {results.length} result{results.length !== 1 ? "s" : ""} found
              </p>
            )}
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <p>Searching...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center border rounded-lg">
              <p className="text-muted-foreground">{error}</p>
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col lg:flex-wrap lg:flex-row items-center justify-center w-full gap-5">
              {results.map((result) => (
                <Link href={`/profile/${result.id}`} key={result.id} className="flex items-center justify-center w-full max-w-[700px]">
                  <Card className="hover:bg-muted/50 transition-colors w-full">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h2 className="text-xl font-semibold">{result.name}</h2>
                            <Badge variant={result.type === "landlord" ? "default" : "secondary"}>
                              {result.type === "landlord" ? "Landlord" : "Tenant"}
                            </Badge>
                          </div>

                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{result.location}</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-start sm:items-end gap-1">
                          <div className="flex items-center">
                            <StarRating rating={result.rating} setRating={() => {}} readOnly size={20} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {result.reviewCount} review{result.reviewCount !== 1 ? "s" : ""}
                            {result.lastReviewDate && ` • Last review ${result.lastReviewDate}`}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center border rounded-lg">
              <p className="text-muted-foreground">
                {name && location
                  ? `No results found for ${type === "landlord" ? "landlord" : "tenant"} "${name}" in ${location}`
                  : name
                    ? `No results found for ${type === "landlord" ? "landlord" : "tenant"} "${name}"`
                    : "Please enter a search term"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}