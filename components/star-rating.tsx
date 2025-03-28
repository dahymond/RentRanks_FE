"use client"

import { useState } from "react"
import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  setRating: (rating: number) => void
  count?: number
  size?: number
  readOnly?: boolean
}

export function StarRating({ rating, setRating, count = 5, size = 24, readOnly = false }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const handleStarClick = (index: number) => {
    if (!readOnly) {
      // If clicking the same star twice, clear the rating
      if (rating === index) {
        setRating(0)
      } else {
        setRating(index)
      }
    }
  }

  const handleStarHover = (index: number) => {
    if (!readOnly) {
      setHoverRating(index)
    }
  }

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0)
    }
  }

  return (
    <div className="flex items-center">
      {[...Array(count)].map((_, index) => {
        const starValue = index + 1
        const isFilled = hoverRating ? starValue <= hoverRating : starValue <= rating

        return (
          <button
            type="button"
            key={index}
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => handleStarHover(starValue)}
            onMouseLeave={handleMouseLeave}
            disabled={readOnly}
            className={`p-1 ${readOnly ? "cursor-default" : "cursor-pointer"}`}
            aria-label={`${starValue} star${starValue !== 1 ? "s" : ""}`}
          >
            <Star
              size={size}
              className={`${
                isFilled ? "fill-accent text-accent" : "fill-transparent text-muted-foreground"
              } transition-colors`}
            />
          </button>
        )
      })}

      {!readOnly && (
        <span className="ml-2 text-sm text-muted-foreground">
          {rating > 0 ? rating : ""} {rating === 1 ? "star" : rating > 1 ? "stars" : ""}
        </span>
      )}
    </div>
  )
}