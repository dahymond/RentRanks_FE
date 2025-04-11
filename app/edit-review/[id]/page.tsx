"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/star-rating";
import { PenLine, ArrowLeft, Check, MapPin } from "lucide-react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

interface ReviewData {
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
  created_at: string;
}

export default function EditReviewPage() {
  const router = useRouter();

  const params = useParams();
  const id = params.id as string;
  const reviewId = id.startsWith("r") ? id.substring(1) : id;
  // id = id.split('r')[1]

  const { data: session, status: sessionStatus } = useSession();
  const [review, setReview] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/reviews/${reviewId}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.djangoJwt}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch review");
        }

        const data = await response.json();
        setReview(data);
        setRating(data.rating);
        setComment(data.comment);
        setIsAnonymous(data.is_anonymous);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch review");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user && id) {
      fetchReview();
    }
  }, [id, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/reviews/${reviewId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.djangoJwt}`,
          },
          body: JSON.stringify({
            rating,
            comment,
            is_anonymous: isAnonymous,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update review");
      }

      toast({
        title: "Success",
        description: "Your review has been updated",
      });

      // Redirect back to profile or review history
      router.push(`/profile/${review?.profile.id}`);
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to update review",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8 flex items-center justify-center">
          <div className="text-center">
            <p>Loading review...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Review Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error || "The review you're looking for doesn't exist"}
            </p>
            <Link href="/my-reviews">
              <Button>Back to My Reviews</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link href={`/profile/${review.profile.id}`}>
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Profile
              </Button>
            </Link>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Edit Your Review</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>for</span>
                <Link
                  href={`/profile/${review.profile.id}`}
                  className="font-medium hover:underline"
                >
                  {review.profile.name}
                </Link>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{review.profile.location}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="rating">Rating</Label>
                <div className="mt-2">
                  <StarRating rating={rating} setRating={setRating} size={24} />
                </div>
              </div>

              <div>
                <Label htmlFor="comment">Review</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mt-2 min-h-[150px]"
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                />
                <Label htmlFor="anonymous">Post anonymously</Label>
              </div>

              <div className="flex justify-end gap-3">
                <Link href={`/profile/${review.profile.id}`}>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    "Saving..."
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
