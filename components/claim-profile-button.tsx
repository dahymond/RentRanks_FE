// components/claim-profile-button.tsx
"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export function ClaimProfileButton({ profileId }: { profileId: string }) {
  const router = useRouter();
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaim = async () => {
    setIsClaiming(true);
    try {
      const response = await fetch("/profiles/claim-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile_id: profileId }),
      });

      if (response.ok) {
        toast({
          title: "Profile claimed successfully",
          description: "You are now the owner of this profile",
        });
        router.refresh();
      } else {
        throw new Error("Failed to claim profile");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <Button onClick={handleClaim} disabled={isClaiming}>
      {isClaiming ? "Claiming..." : "Claim This Profile"}
    </Button>
  );
}
