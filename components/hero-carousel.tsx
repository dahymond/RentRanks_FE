"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const carouselImages = [
  {
    src: "images/happy_landlord.jpg",
    alt: "Beautiful home exterior",
    caption: "Find the perfect home with trusted landlords",
  },
  {
    src: "images/happy_tenants.jpg",
    alt: "Happy family moving in",
    caption: "Connect with reliable tenants for your property",
  },
  {
    src: "images/happy_rating2.jpg",
    alt: "Modern apartment building",
    caption: "Make informed decisions with real reviews",
  },
]

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1))
  }

  // Reset the interval when currentIndex changes
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Set a new interval
    intervalRef.current = setInterval(() => {
      nextSlide()
    }, 5000)

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [currentIndex])

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg">
      {carouselImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="relative w-full h-full">
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              priority={index === currentIndex}
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute bottom-4 left-0 right-0 p-6 text-white text-center mb-3">
            <p className="text-xl md:text-2xl font-medium">{image.caption}</p>
          </div>
        </div>
      ))}

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 text-white hover:bg-white/40"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Previous slide</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 text-white hover:bg-white/40"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Next slide</span>
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentIndex(index)}
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

