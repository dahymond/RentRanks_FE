"use client"
import Link from "next/link"
import { Header } from "@/components/header"
import { SearchBar } from "@/components/search-bar"
import { StarRating } from "@/components/star-rating"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

// Mock data for search results
const mockSearchResults = [
  {
    id: "1",
    name: "John Smith",
    type: "landlord",
    rating: 4,
    reviewCount: 12,
    location: "Philadelphia, PA",
    lastReviewDate: "2025-02-15",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    type: "tenant",
    rating: 5,
    reviewCount: 8,
    location: "New York, NY",
    lastReviewDate: "2025-03-10",
  },
  {
    id: "3",
    name: "Michael Brown",
    type: "landlord",
    rating: 3,
    reviewCount: 5,
    location: "Philadelphia, PA",
    lastReviewDate: "2025-01-22",
  },
  {
    id: "4",
    name: "Emily Davis",
    type: "tenant",
    rating: 4,
    reviewCount: 3,
    location: "Boston, MA",
    lastReviewDate: "2025-03-05",
  },
  {
    id: "5",
    name: "Robert Wilson",
    type: "landlord",
    rating: 2,
    reviewCount: 7,
    location: "Philadelphia, PA",
    lastReviewDate: "2025-02-28",
  },
  {
    id: "6",
    name: "Bob Dylan",
    type: "landlord",
    rating: 3,
    reviewCount: 7,
    location: "Philadelphia, PA",
    lastReviewDate: "2025-02-28",
  },
]

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const type = (searchParams.type as string) || "tenant"
  const name = (searchParams.name as string) || ""
  const location = (searchParams.location as string) || ""

  // Filter results based on search parameters
  // In a real app, this would be a server-side database query
  const filteredResults = mockSearchResults.filter((result) => {
    const typeMatch = type ? result.type === type : true
    const nameMatch = name ? result.name.toLowerCase().includes(name.toLowerCase()) : true
    const locationMatch = location ? result.location.toLowerCase().includes(location.toLowerCase()) : true
    return typeMatch && nameMatch && locationMatch
  })

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
            <p className="text-muted-foreground">
              {filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {filteredResults.length > 0 ? (
            <div className="flex flex-col lg:flex-wrap lg:flex-row items-center justify-center w-full gap-5">
              {filteredResults.map((result) => (
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

