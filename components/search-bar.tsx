"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SearchBar() {
  const router = useRouter()
  
  const searchParams = useSearchParams()
  const type = searchParams?.get('type') || "tenant"
  const name = searchParams?.get('name') || ""
  const location = searchParams?.get('location') || ""

  const [searchType, setSearchType] = useState(type)
  const [searchName, setSearchName] = useState(name)
  const [searchLocation, setSearchLocation] = useState(location)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchName) return

    const params = new URLSearchParams()
    params.set("type", searchType)
    params.set("name", searchName)
    if (searchLocation) params.set("location", searchLocation)

    router.push(`/search?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="w-full md:w-1/4">
          <Select defaultValue="tenant" value={searchType} onValueChange={setSearchType}>
            <SelectTrigger id="search-type">
              <SelectValue placeholder="Search for" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="tenant">Tenant</SelectItem>
              <SelectItem value="landlord">Landlord</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-2/5">
          <Input
            id="search-name"
            type="text"
            placeholder="Name (e.g., John Smith)"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            required
          />
        </div>

        <div className="w-full md:w-2/5">
          <Input
            id="search-location"
            type="text"
            placeholder="City, State (optional)"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full md:w-auto">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </form>
  )
}

