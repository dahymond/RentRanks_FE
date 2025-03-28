"use client";

import type React from "react";

import { useState } from "react";
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
} from "lucide-react";

// Mock data for user profiles
const mockProfiles = {
  "1": {
    id: "1",
    name: "John Smith",
    type: "landlord",
    rating: 4,
    email: "concordchucks@gmail.com",
    profileStatus: "Claimed",
    reviewCount: 12,
    location: "Philadelphia, PA",
    lastReviewDate: "2025-02-15",
    reviews: [
      {
        id: "r1",
        reviewerName: "Michael B",
        date: "2025-03-15",
        location: "Philadelphia, PA",
        rating: 5,
        comment:
          "John was an excellent landlord. The property was always well-maintained and he responded quickly to any issues. He was fair with the security deposit and I would definitely rent from him again. Highly recommended for anyone looking for a reliable landlord in the area.",
      },
      {
        id: "r2",
        reviewerName: "Sarah J",
        date: "2025-02-10",
        location: "Philadelphia, PA",
        rating: 4,
        comment:
          "Overall a good experience renting from John. He was responsive to maintenance requests and the property was in good condition. The only issue was that sometimes it took a few days to get a response to non-urgent matters. Would rent from him again.",
      },
      {
        id: "r3",
        reviewerName: "David K",
        date: "2025-01-05",
        location: "Philadelphia, PA",
        rating: 3,
        comment:
          "John was an okay landlord. The property was decent but there were some issues with appliances that took longer than expected to fix. Communication was sometimes spotty, but rent collection and lease terms were fair and straightforward.",
      },
    ],
  },
  "2": {
    id: "2",
    name: "Sarah Johnson",
    type: "tenant",
    email: "sarah_jayyy@gmail.com",
    rating: 5,
    reviewCount: 8,
    profileStatus: "Claimed",
    location: "New York, NY",
    lastReviewDate: "2025-03-10",
    reviews: [
      {
        id: "r4",
        reviewerName: "Robert W",
        date: "2025-03-10",
        location: "New York, NY",
        rating: 5,
        comment:
          "Sarah was an exceptional tenant. She always paid rent on time, kept the property in immaculate condition, and was respectful of neighbors. Communication was excellent and she reported any minor issues promptly. I would rent to her again without hesitation.",
      },
      {
        id: "r5",
        reviewerName: "Jennifer L",
        date: "2025-02-22",
        location: "New York, NY",
        rating: 5,
        comment:
          "Perfect tenant in every way. Sarah maintained the apartment beautifully, was quiet and considerate, and always paid rent early. When she moved out, the place was spotless. Any landlord would be lucky to have her as a tenant.",
      },
    ],
  },
};

export default function ProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const profile = mockProfiles[id as keyof typeof mockProfiles];

  const [isSaved, setIsSaved] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [shareEmail, setShareEmail] = useState("");

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The profile you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const handleSave = () => {
    setIsSaved(!isSaved);
    // In a real app, this would save to user's account
  };

  const handleCopyLink = () => {
    // In a real app, this would use the actual URL
    navigator.clipboard.writeText(
      `https://rentranks.com/profile/${profile.id}`
    );
    setIsLinkCopied(true);
    setTimeout(() => setIsLinkCopied(false), 2000);
  };

  const handleShareViaEmail = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send an email
    console.log(`Sharing profile with ${shareEmail}`);
    setShareEmail("");
    // Close dialog would happen here
  };

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
                  <Badge variant={"outline"}>{"Profile Status"}</Badge>
                  <Badge variant={"secondary"}>{profile.profileStatus}</Badge>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
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
              <Link
                href={`/submit-review?target=${profile.id}&type=${profile.type}`}
              >
                <Button className="gap-2">
                  <PenLine className="h-4 w-4" />
                  Leave a Review
                </Button>
              </Link>

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

            {profile.reviews.length > 0 ? (
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
        </div>
      </main>
    </div>
  );
}
