"use client"

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/star-rating";
import { format } from "date-fns";
import { PenLine, Bookmark, BookmarkCheck, MapPin } from "lucide-react";
import Link from "next/link";

interface ReviewHistory {
  reviewer: {
    id: string;
    name: string;
    email: string;
  };
  total_reviews: number;
  reviews: {
    id: string;
    profile: {
      id: string;
      name: string;
      type: string;
      location: string;
    };
    rating: number;
    comment: string;
    is_anonymous: boolean;
    date: string;
    can_edit: boolean;
  }[];
}

export default function MyReviewsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [reviewHistory, setReviewHistory] = useState<ReviewHistory | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchReviewHistory = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/reviews/my-reviews/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.djangoJwt}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch review history");
        }

        const data = await response.json();
        setReviewHistory(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch review history"
        );
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchReviewHistory();
    }
  }, [session]);

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8 flex items-center justify-center">
          <div className="text-center">
            <p>Loading your reviews...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !reviewHistory) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Unable to Load Reviews</h1>
            <p className="text-muted-foreground mb-6">
              {error || "There was a problem loading your review history"}
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Review History Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">Your Review History</h1>
                <div className="flex items-center text-muted-foreground">
                  <span>
                    {reviewHistory.total_reviews} review
                    {reviewHistory.total_reviews !== 1 ? "s" : ""} across{" "}
                    {
                      new Set(reviewHistory.reviews.map((r) => r.profile.id))
                        .size
                    }{" "}
                    profile{reviewHistory.reviews.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">
                  Average rating:{" "}
                  {(
                    reviewHistory.reviews.reduce(
                      (sum, review) => sum + review.rating,
                      0
                    ) / reviewHistory.total_reviews
                  ).toFixed(1)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="gap-2" onClick={handleSave}>
                {isSaved ? (
                  <>
                    <BookmarkCheck className="h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4" />
                    Save History
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">
              Your Reviews ({reviewHistory.total_reviews})
            </h2>

            {reviewHistory.total_reviews > 0 ? (
              <div className="space-y-8">
                {reviewHistory.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="space-y-4 p-4 border rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <Link href={`/profile/${review.profile.id}`}>
                          <h3 className="font-medium text-lg hover:underline">
                            {review.profile.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                          <span className="capitalize">
                            {review.profile.type}
                          </span>
                          <span>•</span>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{review.profile.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <StarRating
                          rating={review.rating}
                          setRating={() => {}}
                          readOnly
                          size={16}
                        />
                        <span className="text-sm text-muted-foreground mt-1">
                          {format(new Date(review.date), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Link href={`/profile/${review.profile.id}`}>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </Link>
                      {review.can_edit && (
                        <Link href={`/edit-review/${review.id}`}>
                          <Button variant="outline" size="sm" className="gap-1">
                            <PenLine className="h-4 w-4" />
                            Edit
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border rounded-lg">
                <p className="text-muted-foreground mb-4">
                  You haven't left any reviews yet
                </p>
                <Link href="/profiles">
                  <Button>Browse Profiles</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
