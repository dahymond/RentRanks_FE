"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock address suggestions for demonstration
const mockAddressSuggestions = [
  {
    addressLine1: "123 Main St",
    city: "Philadelphia",
    state: "PA",
    zipCode: "19107",
  },
  {
    addressLine1: "456 Market St",
    city: "Philadelphia",
    state: "PA",
    zipCode: "19106",
  },
  {
    addressLine1: "789 Broad St",
    city: "Philadelphia",
    state: "PA",
    zipCode: "19108",
  },
  {
    addressLine1: "101 Park Ave",
    city: "New York",
    state: "NY",
    zipCode: "10178",
  },
  {
    addressLine1: "555 5th Ave",
    city: "New York",
    state: "NY",
    zipCode: "10017",
  },
]

interface AddressData {
  addressLine1: string
  city: string
  state: string
  zipCode: string
}

interface AddressAutocompleteProps {
  value: string
  onChange: (address: AddressData) => void
}

export function AddressAutocomplete({ value, onChange }: AddressAutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const [suggestions, setSuggestions] = useState<AddressData[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // Search for address suggestions
  const searchAddresses = (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([])
      return
    }

    // In a real app, this would be an API call to a geocoding service
    // For demo purposes, we're using mock data
    const filteredSuggestions = mockAddressSuggestions.filter((address) =>
      address.addressLine1.toLowerCase().includes(query.toLowerCase()),
    )

    setSuggestions(filteredSuggestions)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    searchAddresses(newValue)
  }

  const handleSelectAddress = (address: AddressData) => {
    setInputValue(address.addressLine1)
    onChange(address)
    setOpen(false)
  }

  return (
    <Popover open={open && suggestions.length > 0} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => searchAddresses(inputValue)}
            className="w-full"
            placeholder="Enter street address"
          />
          <ChevronsUpDown className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>No addresses found</CommandEmpty>
            <CommandGroup>
              {suggestions.map((address, index) => (
                <CommandItem key={index} value={address.addressLine1} onSelect={() => handleSelectAddress(address)}>
                  <div className="flex flex-col">
                    <span>{address.addressLine1}</span>
                    <span className="text-xs text-muted-foreground">
                      {address.city}, {address.state} {address.zipCode}
                    </span>
                  </div>
                  <Check
                    className={cn("ml-auto h-4 w-4", inputValue === address.addressLine1 ? "opacity-100" : "opacity-0")}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

