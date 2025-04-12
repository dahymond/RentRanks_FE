"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Header } from "@/components/header";
import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  PenLine,
  Bookmark,
  Share2,
  Mail,
  Copy,
  Check,
  BookmarkCheck,
  CheckCircle2,
} from "lucide-react";
import { getSession, useSession } from "next-auth/react";
import { ClaimProfileButton } from "@/components/claim-profile-button";
import { useToast } from "@/components/ui/use-toast";

interface Review {
  id: string;
  reviewerName: string;
  date: string;
  location: string;
  rating: number;
  comment: string;
}

interface ProfileData {
  id: string;
  name: string;
  type: string;
  rating: number;
  email: string;
  profileStatus: string;
  is_claimed: boolean;
  // claimed_by: string;
  reviewCount: number;
  location: string;
  lastReviewDate: string | null;
  canReview: boolean;
  reviews: Review[];
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const id = params.id as string;
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [canClaim, setCanClaim] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/profiles/${id}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.djangoJwt}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Profile not found");
        }

        const data = await response.json();
        setProfile(data);

        // Check if current user can claim this profile
        if (session?.user?.email === data.email && !data.is_claimed) {
          setCanClaim(true);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch profile"
        );
        //   toast({
        //   title: "Error",
        //   description: "Failed to load profile data",
        //   variant: "destructive",
        // });
      } finally {
        setLoading(false);
      }
    };
    if (session?.user) {
      fetchProfile();
    }
  }, [id, session, status]);

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://rentranks.com/profile/${id}`);
    setIsLinkCopied(true);
    setTimeout(() => setIsLinkCopied(false), 2000);
  };

  const handleShareViaEmail = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Sharing profile with ${shareEmail}`);
    setShareEmail("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8 flex items-center justify-center">
          <div className="text-center">
            <p>Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8 flex items-center justify-center">
          <div className="text-center m-10">
            <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
            <p className="text-muted-foreground mx-5 mb-6">
              {error || "The profile you're looking for doesn't exist"}
            </p>
            <Link href="/">
              <Button>Return to Home</Button>
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
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">{profile.name}</h1>
                  <Badge
                    variant={
                      profile.type === "landlord" ? "default" : "secondary"
                    }
                    className="text-sm"
                  >
                    {profile.type === "landlord" ? "Landlord" : "Tenant"}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  {/* <Badge variant={"outline"}>{"Profile Status->"}</Badge> */}
                  <div className="text-sm">{"Profile Status"}</div>
                  <Badge variant={"secondary"}>{profile.profileStatus} </Badge>
                </div>

                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-4 w-4 mr-1" />
                  <span>{profile.email}</span>
                </div>

                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{profile.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StarRating
                  rating={profile.rating}
                  setRating={() => {}}
                  readOnly
                />
                <span className="text-muted-foreground">
                  ({profile.reviewCount} review
                  {profile.reviewCount !== 1 ? "s" : ""})
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {profile.canReview && (
                <Link
                  href={`/submit-review?target=${profile.id}&type=${profile.type}`}
                >
                  <Button className="gap-2">
                    <PenLine className="h-4 w-4" />
                    Leave a Review
                  </Button>
                </Link>
              )}

              <Button variant="outline" className="gap-2" onClick={handleSave}>
                {isSaved ? (
                  <>
                    <BookmarkCheck className="h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4" />
                    Save
                  </>
                )}
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share this profile</DialogTitle>
                    <DialogDescription>
                      Share this profile with others via link or email
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Copy link</p>
                      <div className="flex items-center gap-2">
                        <Input
                          value={`https://rentranks.com/profile/${profile.id}`}
                          readOnly
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          onClick={handleCopyLink}
                          variant="outline"
                        >
                          {isLinkCopied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <form onSubmit={handleShareViaEmail} className="space-y-2">
                      <p className="text-sm font-medium">Share via email</p>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="Email address"
                            className="pl-8"
                            value={shareEmail}
                            onChange={(e) => setShareEmail(e.target.value)}
                            required
                          />
                        </div>
                        <Button type="submit" size="sm">
                          Send
                        </Button>
                      </div>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Reviews Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">
              Reviews ({profile.reviewCount})
            </h2>

            {profile?.reviewCount > 0 ? (
              <div className="space-y-8">
                {profile.reviews.map((review) => (
                  <div key={review.id} className="space-y-4">
                    <div className="flex justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">{review.reviewerName}</p>
                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                          <span>
                            {format(new Date(review.date), "MMM d, yyyy")}
                          </span>
                          <span>•</span>
                          <span>{review.location}</span>
                        </div>
                      </div>
                      <StarRating
                        rating={review.rating}
                        setRating={() => {}}
                        readOnly
                        size={16}
                      />
                    </div>

                    <p className="text-muted-foreground">{review.comment}</p>

                    <Separator />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border rounded-lg">
                <p className="text-muted-foreground">No reviews yet</p>
              </div>
            )}
          </div>

          {canClaim && (
            <div className="mt-8 p-4 border rounded-lg bg-muted">
              <h3 className="font-medium mb-2">
                This profile matches your email
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Would you like to claim this profile?
              </p>
              <ClaimProfileButton profileId={id} />
            </div>
          )}

          {/* Show claimed status if applicable */}
          {profile?.is_claimed &&
            profile.profileStatus == "Claimed by you" &&
            profile?.email === session?.user?.email && (
              <div className="mt-4 p-4 border rounded-lg bg-accent/10">
                <div className="flex items-center gap-2 text-accent">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>You own this profile</span>
                </div>
              </div>
            )}
        </div>
      </main>
    </div>
  );
}
